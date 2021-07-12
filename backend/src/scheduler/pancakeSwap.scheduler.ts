import Scheduler from './scheduler';
import { sequelize } from '../model';
import { PancakeSwap } from '../defi/pancakeSwap';
import { STATUS } from '../service';
import { isNull } from '../helper/type.helper';
import {
  getRegisteredPool,
  getRegisteredToken,
  updatePool,
  registerPool,
  deactivatePool,
  tokenInit,
  calculateApr,
} from './common';
import { fillSequenceNumber, toSplitWithReturnSize } from '../helper/array.helper';
import { getTokenBalance, getTokenProperty } from '../helper/erc20.helper';
import { isZero, div, mul, isGreaterThanOrEqual } from '../helper/bignumber.helper';
import { oneDaySeconds, oneYearDays } from '../helper/constant.helper';
import { divideDecimals } from '../helper/decimals.helper';

class PancakeSwapScheduler extends Scheduler {
  name: string = 'PancakeSwapScheduler';
  working: boolean = false;

  async init() {
    await PancakeSwap.init();
  }

  async getMasterChefState() {
    const [totalAllocPoint, totalPoolLength, rewardPerBlock] = await Promise.all([
      PancakeSwap.getTotalAllocPoint(),
      PancakeSwap.getPoolLength(),
      PancakeSwap.getCakePerBlock(),
    ]);

    // 블록 당 리워드 갯수
    const rewardsInOneBlock = divideDecimals(rewardPerBlock.toString(), PancakeSwap.cakeToken.decimals);
    // 하루 총 생성 블록 갯수
    const blocksInOneDay = div(oneDaySeconds, PancakeSwap.network.block_time_sec);
    // 하루 총 리워드 갯수
    const totalRewardInOneDay = mul(rewardsInOneBlock, blocksInOneDay);
    // 하루 총 리워드 USD 가격
    const totalRewardPriceInOneDay = mul(totalRewardInOneDay, PancakeSwap.cakeToken.price_usd);
    // 일년 총 리워드 USD 가격
    const totalRewardPriceInOneYear = mul(totalRewardPriceInOneDay, oneYearDays);

    return {
      totalAllocPoint,
      totalPoolLength,
      totalRewardPriceInOneYear,
    };
  }

  async initMasterChefPool(poolInfo: { pid: number; lpToken: string; allocPoint: number }, transaction: any = null) {
    const tokenPair = await PancakeSwap.getPair(poolInfo.lpToken);
    const { name, symbol, decimals } = await getTokenProperty(PancakeSwap.provider, poolInfo.lpToken);

    // 토큰 상태 확인 및 초기화
    await tokenInit(
      { network_id: PancakeSwap.network.id, address: poolInfo.lpToken, name, symbol, decimals },
      tokenPair,
      transaction,
    );

    // 등록된 스테이크 토큰
    const stakeToken = await getRegisteredToken(
      { network_id: PancakeSwap.network.id, address: poolInfo.lpToken },
      transaction,
    );

    // 풀 추가
    await registerPool(
      {
        protocol_id: PancakeSwap.protocol.id,
        type: PancakeSwap.constants.poolType.masterChef,
        name: `${stakeToken.symbol}/${PancakeSwap.cakeToken.symbol}`,
        pid: poolInfo.pid,
        stake_token_id: stakeToken.id,
        reward_token_id: PancakeSwap.cakeToken.id,
      },
      transaction,
    );
  }

  async initSmartChefPool(
    poolInfo: {
      address: string;
      stakeToken: { id: string; name: string; symbol: string; decimals: string };
      rewardToken: { id: string; name: string; symbol: string; decimals: string };
    },
    transaction: any = null,
  ) {
    const [stakeTokenPair, rewardTokenPair] = await Promise.all([
      PancakeSwap.getPair(poolInfo.stakeToken.id),
      PancakeSwap.getPair(poolInfo.rewardToken.id),
    ]);

    // 스테이크 토큰 상태 확인 및 초기화
    await tokenInit(
      {
        network_id: PancakeSwap.network.id,
        address: poolInfo.stakeToken.id,
        name: poolInfo.stakeToken.name,
        symbol: poolInfo.stakeToken.symbol,
        decimals: Number(poolInfo.stakeToken.decimals),
      },
      stakeTokenPair,
      transaction,
    );

    // 리워드 토큰 상태 확인 및 초기화
    await tokenInit(
      {
        network_id: PancakeSwap.network.id,
        address: poolInfo.rewardToken.id,
        name: poolInfo.rewardToken.name,
        symbol: poolInfo.rewardToken.symbol,
        decimals: Number(poolInfo.rewardToken.decimals),
      },
      rewardTokenPair,
      transaction,
    );

    // 등록된 스테이크, 리워드 토큰
    const [registeredStakeToken, registeredRewardToken] = await Promise.all([
      getRegisteredToken({ network_id: PancakeSwap.network.id, address: poolInfo.stakeToken.id }, transaction),
      getRegisteredToken({ network_id: PancakeSwap.network.id, address: poolInfo.rewardToken.id }, transaction),
    ]);

    // 풀 추가
    await registerPool(
      {
        protocol_id: PancakeSwap.protocol.id,
        type: PancakeSwap.constants.poolType.smartChef,
        name: `${registeredStakeToken.symbol}/${registeredRewardToken.symbol}`,
        address: poolInfo.address,
        stake_token_id: registeredStakeToken.id,
        reward_token_id: registeredRewardToken.id,
      },
      transaction,
    );
  }

  async updateMasterChefPools() {
    try {
      const { totalAllocPoint, totalPoolLength, totalRewardPriceInOneYear } = await this.getMasterChefState();

      // DataBase 트랜잭션 부하로 인해 파트 나누기
      const pids = fillSequenceNumber(totalPoolLength.toNumber());
      const chunks = toSplitWithReturnSize(pids, 100);

      for (let i = 0; i < chunks.length; i += 1) {
        const transaction = await sequelize.transaction();

        try {
          await Promise.all(
            chunks[i].map(async (pid) => {
              const pool = await getRegisteredPool({ protocol_id: PancakeSwap.protocol.id, pid }, transaction);

              const { 0: lpToken, 1: allocPoint } = await PancakeSwap.getPoolInfo(pid);
              const allocPointNumber = allocPoint.toNumber();
              if (isNull(pool)) {
                if (isZero(allocPointNumber)) return;
                await this.initMasterChefPool({ pid, lpToken, allocPoint: allocPointNumber }, transaction);
              } else {
                if (isZero(allocPointNumber)) {
                  await deactivatePool({ protocol_id: PancakeSwap.protocol.id, pid }, transaction);
                  return;
                }
              }

              const { stakeToken: targetToken } = await getRegisteredPool(
                { protocol_id: PancakeSwap.protocol.id, pid },
                transaction,
              );
              // 풀의 총 공급량
              const poolLiquidityAmount = divideDecimals(
                (
                  await getTokenBalance(
                    PancakeSwap.provider,
                    targetToken.address,
                    PancakeSwap.constants.masterChefAddress,
                  )
                ).toString(),
                targetToken.decimals,
              );
              // 풀의 총 유동량(USD)
              const poolLiquidityValue = isNull(targetToken.price_usd)
                ? null
                : isNull(targetToken.price_usd)
                ? null
                : mul(poolLiquidityAmount, targetToken.price_usd);

              // 풀의 총 점유율
              const poolSharePointOfTotal = div(allocPoint, totalAllocPoint);
              if (isZero(poolSharePointOfTotal)) return;
              // 풀의 총 리워드 일년 할당량(USD)
              const poolShareRewardValueOfTotalInOneYear = mul(totalRewardPriceInOneYear, poolSharePointOfTotal);
              // 풀의 APR
              const poolApr = calculateApr(poolLiquidityValue, poolShareRewardValueOfTotalInOneYear);

              await updatePool(
                {
                  protocol_id: PancakeSwap.protocol.id,
                  pid,
                },
                {
                  liquidity_amount: poolLiquidityAmount.toString(),
                  liquidity_usd: isNull(poolLiquidityValue) ? null : poolLiquidityValue.toString(),
                  apy: null,
                  apr: isNull(poolApr) ? null : poolApr.toString(),
                  status: STATUS.ACTIVATE,
                },
                transaction,
              );
            }),
          );

          await transaction.commit();
        } catch (e) {
          await transaction.rollback();
        }
      }
      return;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateSmartChefPools() {
    try {
      const smartChefs = await PancakeSwap.getSmartChefsInfo();
      const chunks = toSplitWithReturnSize(smartChefs, 50);

      for (let i = 0; i < chunks.length; i += 1) {
        const transaction = await sequelize.transaction();

        try {
          await Promise.all(
            chunks[i].map(async ({ id, stakeToken, earnToken, reward, endBlock }) => {
              const pool = await getRegisteredPool({ protocol_id: PancakeSwap.protocol.id, address: id }, transaction);
              const curBlockNumber = await PancakeSwap.getBlockNumber();

              if (!isNull(pool) && isGreaterThanOrEqual(curBlockNumber, endBlock)) {
                await deactivatePool({ protocol_id: PancakeSwap.protocol.id, address: id }, transaction);
                return;
              }

              if (isNull(pool)) {
                if (isGreaterThanOrEqual(curBlockNumber, endBlock)) return;
                await this.initSmartChefPool(
                  {
                    address: id,
                    stakeToken,
                    rewardToken: earnToken,
                  },
                  transaction,
                );
              }

              const { stakeToken: targetStakeToken, rewardToken: targetRewardToken } = await getRegisteredPool(
                { protocol_id: PancakeSwap.protocol.id, address: id },
                transaction,
              );

              // 풀 총 공급량
              const poolLiquidityAmount = divideDecimals(
                (await getTokenBalance(PancakeSwap.provider, targetStakeToken.address, id)).toString(),
                targetStakeToken.decimals,
              );
              // 풀의 총 유동량(USD)
              const poolLiquidityValue = isNull(targetStakeToken.price_usd)
                ? null
                : isNull(targetStakeToken.price_usd)
                ? null
                : mul(poolLiquidityAmount, targetStakeToken.price_usd);
              // 블록 당 리워드 갯수
              const rewardsInOneBlock = reward;
              // 하루 총 생성 블록 갯수
              const blocksInOneDay = div(oneDaySeconds, PancakeSwap.network.block_time_sec);
              // 하루 총 리워드 갯수
              const totalRewardInOneDay = mul(rewardsInOneBlock, blocksInOneDay);
              // 하루 총 리워드 USD 가격
              const totalRewardPriceInOneDay = isNull(targetRewardToken.price_usd)
                ? null
                : mul(totalRewardInOneDay, targetRewardToken.price_usd);
              // 일년 총 리워드 USD 가격
              const totalRewardPriceInOneYear = isNull(totalRewardPriceInOneDay)
                ? null
                : mul(totalRewardPriceInOneDay, oneYearDays);

              const poolApr = calculateApr(poolLiquidityValue, totalRewardPriceInOneYear);

              await updatePool(
                {
                  protocol_id: PancakeSwap.protocol.id,
                  address: id,
                },
                {
                  liquidity_amount: poolLiquidityAmount.toString(),
                  liquidity_usd: isNull(poolLiquidityValue) ? null : poolLiquidityValue.toString(),
                  apy: null,
                  apr: isNull(poolApr) ? null : poolApr.toString(),
                  status: STATUS.ACTIVATE,
                },
                transaction,
              );
            }),
          );

          await transaction.commit();
        } catch (e) {
          await transaction.rollback();
          throw new Error(e);
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async run() {
    try {
      this.working = true;
      await Promise.all([this.updateMasterChefPools(), this.updateSmartChefPools()]);
      this.working = false;
    } catch (e) {
      console.log(e);
      this.handleError(e);
    }
  }
}

export default new PancakeSwapScheduler();
