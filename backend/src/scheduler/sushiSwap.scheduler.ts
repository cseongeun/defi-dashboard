import { sequelize } from '../model';
import { SushiSwap } from '../defi/sushiSwap';
import { STATUS } from '../service';
import Scheduler from './scheduler';
import { divideDecimals } from '../helper/decimals.helper';
import { oneDaySeconds, oneYearDays } from '../helper/constant.helper';
import { isZero, div, mul } from '../helper/bignumber.helper';
import { fillSequenceNumber, toSplitWithReturnSize } from '../helper/array.helper';
import { isNull } from '../helper/type.helper';
import { getTokenBalance, getTokenProperty } from '../helper/erc20.helper';
import {
  getRegisteredPool,
  getRegisteredToken,
  updatePool,
  registerPool,
  deactivatePool,
  tokenInit,
  calculateApr,
} from './common';

class SushiSwapScheduler extends Scheduler {
  name: string = 'SushiSwapScheduler';

  async init() {
    await SushiSwap.init();
  }

  async getMasterChefState() {
    const [totalAllocPoint, totalPoolLength, rewardPerBlock] = await Promise.all([
      SushiSwap.getTotalAllocPoint(),
      SushiSwap.getPoolLength(),
      SushiSwap.getSushiPerBlock(),
    ]);

    // 블록 당 리워드 갯수
    const rewardsInOneBlock = divideDecimals(rewardPerBlock.toString(), SushiSwap.sushiToken.decimals);
    // 하루 총 생성 블록 갯수
    const blocksInOneDay = div(oneDaySeconds, SushiSwap.network.block_time_sec);
    // 하루 총 리워드 갯수
    const totalRewardInOneDay = mul(rewardsInOneBlock, blocksInOneDay);
    // 하루 총 리워드 USD 가격
    const totalRewardPriceInOneDay = mul(totalRewardInOneDay, SushiSwap.sushiToken.price_usd);
    // 일년 총 리워드 USD 가격
    const totalRewardPriceInOneYear = mul(totalRewardPriceInOneDay, oneYearDays);

    return {
      totalAllocPoint,
      totalPoolLength,
      totalRewardPriceInOneYear,
    };
  }

  async initMasterChefPool(poolInfo: { pid: number; lpToken: string; allocPoint: number }, transaction: any = null) {
    const tokenPair = await SushiSwap.getPair(poolInfo.lpToken);

    const { name, symbol, decimals } = await getTokenProperty(SushiSwap.provider, poolInfo.lpToken);

    // 토큰 상태 확인 및 초기화
    await tokenInit(
      { network_id: SushiSwap.network.id, address: poolInfo.lpToken, name, symbol, decimals },
      tokenPair,
      transaction,
    );

    // 등록된 스테이크 토큰
    const stakeToken = await getRegisteredToken(
      { network_id: SushiSwap.network.id, address: poolInfo.lpToken },
      transaction,
    );

    // 풀 추가
    await registerPool(
      {
        protocol_id: SushiSwap.protocol.id,
        type: SushiSwap.constants.poolType.masterChef,
        name: `${stakeToken.symbol}/${SushiSwap.sushiToken.symbol}`,
        pid: poolInfo.pid,
        stake_token_id: stakeToken.id,
        reward_token_id: SushiSwap.sushiToken.id,
      },
      transaction,
    );
  }

  async updateMasterChefPools() {
    try {
      const { totalAllocPoint, totalPoolLength, totalRewardPriceInOneYear } = await this.getMasterChefState();

      const pids = fillSequenceNumber(totalPoolLength.toNumber());
      const chunks = toSplitWithReturnSize(pids, 100);

      for (let i = 0; i < chunks.length; i += 1) {
        const transaction = await sequelize.transaction();

        try {
          await Promise.all(
            chunks[i].map(async (pid) => {
              const pool = await getRegisteredPool({ protocol_id: SushiSwap.protocol.id, pid }, transaction);

              const { 0: lpToken, 1: allocPoint } = await SushiSwap.getPoolInfo(pid);
              const allocPointNumber = allocPoint.toNumber();

              // 풀 상태 확인 및 풀 등록
              if (isNull(pool)) {
                if (isZero(allocPointNumber)) return;
                await this.initMasterChefPool({ pid, lpToken, allocPoint: allocPointNumber }, transaction);
              } else {
                if (isZero(allocPointNumber)) {
                  await deactivatePool({ protocol_id: SushiSwap.protocol.id, pid }, transaction);
                  return;
                }
              }
              const { stakeToken: targetToken } = await getRegisteredPool(
                { protocol_id: SushiSwap.protocol.id, pid },
                transaction,
              );

              // 풀의 총 공급량
              const poolLiquidityAmount = divideDecimals(
                (
                  await getTokenBalance(SushiSwap.provider, targetToken.address, SushiSwap.constants.masterChefAddress)
                ).toString(),
                targetToken.decimals,
              );

              // 풀의 총 유동량(USD)
              const poolLiquidityValue = isNull(poolLiquidityAmount)
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
                  protocol_id: SushiSwap.protocol.id,
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
          throw new Error(e);
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async run() {
    await Promise.all([this.updateMasterChefPools()]);
  }
}

(async () => {
  const sushi = new SushiSwapScheduler();
  await sushi.init();
  await sushi.run();
})();
