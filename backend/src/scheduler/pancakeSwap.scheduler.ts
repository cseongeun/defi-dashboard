import Scheduler from './scheduler';
import { sequelize } from '../model';
import { PancakeSwap } from '../defi/pancakeSwap';
import { TokenService, PoolService, TokenType, STATUS } from '../service';
import { isNull } from '../helper/type.helper';
import { fillSequenceNumber, toSplitWithReturnSize } from '../helper/array.helper';
import { getTokenBalance, getTokenDecimals, getTokenName, getTokenProperty } from '../helper/erc20.helper';
import { isZero, toFixed, div, mul, isGreaterThan, isGreaterThanOrEqual } from '../helper/bignumber.helper';
import { zero, oneDaySeconds, oneYearDays } from '../helper/constant.helper';
import { divideDecimals } from '../helper/decimals.helper';

class PancakeSwapScheduler extends Scheduler {
  name: string = 'PancakeSwapScheduler';
  cake: any;

  async init() {
    await PancakeSwap.init();
    this.cake = await this.getRegisteredToken(PancakeSwap.constants.cakeTokenAddress);
  }

  async getRegisteredMasterChefPool(pid: number, transaction: any = null) {
    return PoolService.findOne({ protocol_id: PancakeSwap.protocol.id, pid }, { transaction });
  }

  async getRegisteredSmartChefPool(address: string, transaction: any = null) {
    return PoolService.findOne({ protocol_id: PancakeSwap.protocol.id, address }, { transaction });
  }

  async getRegisteredToken(address: string, transaction: any = null) {
    return TokenService.findOne({ network_id: PancakeSwap.network.id, address }, { transaction });
  }

  async registerPool(
    params: {
      name: string;
      type: string;
      address?: string;
      pid?: number;
      stake_token_id: number;
      reward_token_id: number;
    },
    transaction: any = null,
  ) {
    return PoolService.create(
      {
        protocol_id: PancakeSwap.protocol.id,
        status: STATUS.ACTIVATE,
        ...params,
      },
      transaction,
    );
  }

  async registerToken(
    params: {
      type: string;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
      pair0_token_id?: number;
      pair1_token_id?: number;
    },
    transaction: any = null,
  ) {
    return TokenService.create({ network_id: PancakeSwap.network.id, status: STATUS.ACTIVATE, ...params }, transaction);
  }

  async updateMasterChefPool(
    pid: number,
    params: {
      liquidity_amount: string | null;
      liquidity_usd: string | null;
      apy: string | null;
      apr: string | null;
      status: string;
    },
    transaction: any = null,
  ) {
    return PoolService.update({ protocol_id: PancakeSwap.protocol.id, pid }, { ...params }, { transaction });
  }

  async updateSmartChefPool(
    address: string,
    params: {
      liquidity_amount: string | null;
      liquidity_usd: string | null;
      apy: string | null;
      apr: string | null;
      status: string;
    },
    transaction: any = null,
  ) {
    return PoolService.update({ protocol_id: PancakeSwap.protocol.id, address }, { ...params }, { transaction });
  }

  async getMasterChefState() {
    const [totalAllocPoint, totalPoolLength, rewardPerBlock] = await Promise.all([
      PancakeSwap.getTotalAllocPoint(),
      PancakeSwap.getPoolLength(),
      PancakeSwap.getCakePerBlock(),
    ]);

    // 블록 당 리워드 갯수
    const rewardsInOneBlock = divideDecimals(rewardPerBlock.toString(), this.cake.decimals);
    // 하루 총 생성 블록 갯수
    const blocksInOneDay = div(oneDaySeconds, PancakeSwap.network.block_time_sec);
    // 일년 총 생성 블록 갯수
    const blocksInOneYear = mul(blocksInOneDay, oneYearDays);
    // 하루 총 리워드 갯수
    const totalRewardInOneDay = mul(rewardsInOneBlock, blocksInOneDay);
    // 일년 총 리워드 갯수
    const totalRewardInOneYear = mul(totalRewardInOneDay, oneYearDays);
    // 하루 총 리워드 USD 가격
    const totalRewardPriceInOneDay = mul(totalRewardInOneDay, this.cake.price_usd);
    // 일년 총 리워드 USD 가격
    const totalRewardPriceInOneYear = mul(totalRewardPriceInOneDay, oneYearDays);

    return {
      totalAllocPoint,
      totalPoolLength,
      totalRewardInOneYear,
      totalRewardPriceInOneYear,
    };
  }

  async deactivateMasterChefPool(pid: number, transaction: any = null) {
    return this.updateMasterChefPool(
      pid,
      {
        liquidity_amount: null,
        liquidity_usd: null,
        apr: null,
        apy: null,
        status: STATUS.DEACTIVATE,
      },
      transaction,
    );
  }

  async deactivateSmartChefPool(address: string, transaction: any = null) {
    return this.updateSmartChefPool(
      address,
      {
        liquidity_amount: null,
        liquidity_usd: null,
        apr: null,
        apy: null,
        status: STATUS.DEACTIVATE,
      },
      transaction,
    );
  }

  async initMasterChefPool(poolInfo: { pid: number; lpToken: string; allocPoint: number }, transaction: any = null) {
    const tokenPair = await PancakeSwap.getPair(poolInfo.lpToken);
    const registeredToken = await this.getRegisteredToken(poolInfo.lpToken, transaction);
    const { name, symbol, decimals } = await getTokenProperty(PancakeSwap.provider, poolInfo.lpToken);

    /* Multi 타입이 아닐 경우 */
    if (isNull(tokenPair)) {
      /* Check V1 Pair pass */
      const lpTokenName = await getTokenName(PancakeSwap.provider, poolInfo.lpToken);
      if (lpTokenName === 'Pancake LPs') return;

      if (isNull(registeredToken)) {
        await this.registerToken(
          {
            type: TokenType.SINGLE,
            name,
            symbol,
            decimals,
            address: poolInfo.lpToken,
          },
          transaction,
        );
      }
    } else {
      const {
        token0: { id: token0Address, name: token0Name, symbol: token0Symbol, decimals: token0Decimals },
        token1: { id: token1Address, name: token1Name, symbol: token1Symbol, decimals: token1Decimals },
      } = tokenPair;

      const [registeredToken0, registeredToken1] = await Promise.all([
        this.getRegisteredToken(token0Address, transaction),
        this.getRegisteredToken(token1Address, transaction),
      ]);

      if (isNull(registeredToken0)) {
        await this.registerToken(
          {
            type: TokenType.SINGLE,
            address: token0Address,
            name: token0Name,
            symbol: token0Symbol,
            decimals: token0Decimals,
          },
          transaction,
        );
      }
      if (isNull(registeredToken1)) {
        await this.registerToken(
          {
            type: TokenType.SINGLE,
            address: token1Address,
            name: token1Name,
            symbol: token1Symbol,
            decimals: token1Decimals,
          },
          transaction,
        );
      }
      if (isNull(registeredToken)) {
        const [pairOfToken0, pairOfToken1] = await Promise.all([
          this.getRegisteredToken(token0Address, transaction),
          this.getRegisteredToken(token1Address, transaction),
        ]);
        await this.registerToken(
          {
            type: TokenType.MULTI,
            address: poolInfo.lpToken,
            name,
            symbol: `${pairOfToken0.symbol}-${pairOfToken1.symbol}`,
            decimals,
            pair0_token_id: pairOfToken0.id,
            pair1_token_id: pairOfToken1.id,
          },
          transaction,
        );
      }
    }
    /* 풀 추가 */
    const stakeToken = await this.getRegisteredToken(poolInfo.lpToken, transaction);
    await this.registerPool(
      {
        type: PancakeSwap.constants.poolType.masterChef,
        name: `${stakeToken.symbol}/${this.cake.symbol}`,
        pid: poolInfo.pid,
        stake_token_id: stakeToken.id,
        reward_token_id: this.cake.id,
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
    const [findStakeToken, findRewardToken] = await Promise.all([
      this.getRegisteredToken(poolInfo.stakeToken.id, transaction),
      this.getRegisteredToken(poolInfo.rewardToken.id, transaction),
    ]);

    if (isNull(findStakeToken)) {
      await this.registerToken(
        {
          type: TokenType.SINGLE,
          name: poolInfo.stakeToken.name,
          symbol: poolInfo.stakeToken.symbol,
          decimals: Number(poolInfo.stakeToken.decimals),
          address: poolInfo.stakeToken.id,
        },
        transaction,
      );
    }
    if (isNull(findRewardToken)) {
      await this.registerToken(
        {
          type: TokenType.SINGLE,
          name: poolInfo.rewardToken.name,
          symbol: poolInfo.rewardToken.symbol,
          decimals: Number(poolInfo.rewardToken.decimals),
          address: poolInfo.rewardToken.id,
        },
        transaction,
      );
    }

    const [registeredStakeToken, registeredRewardToken] = await Promise.all([
      this.getRegisteredToken(poolInfo.stakeToken.id, transaction),
      this.getRegisteredToken(poolInfo.rewardToken.id, transaction),
    ]);

    await this.registerPool(
      {
        type: PancakeSwap.constants.poolType.smartChef,
        name: `${registeredStakeToken.symbol}/${registeredRewardToken.symbol}`,
        address: poolInfo.address,
        stake_token_id: registeredStakeToken.id,
        reward_token_id: registeredRewardToken.id,
      },
      transaction,
    );
  }

  async masterChefPools() {
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
              const pool = await this.getRegisteredMasterChefPool(pid);
              const { 0: lpToken, 1: allocPoint } = await PancakeSwap.getPoolInfo(pid);
              const allocPointNumber = allocPoint.toNumber();
              if (isNull(pool)) {
                if (isZero(allocPointNumber)) return;
                await this.initMasterChefPool({ pid, lpToken, allocPoint: allocPointNumber }, transaction);
              } else {
                if (isZero(allocPointNumber)) {
                  await this.deactivateMasterChefPool(pid, transaction);
                  return;
                }
              }

              const { stakeToken: targetToken } = await this.getRegisteredMasterChefPool(pid, transaction);
              /* 풀의 총 공급량 */
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
                : toFixed(mul(poolLiquidityAmount, targetToken.price_usd));
              // 풀의 총 점유율
              const poolSharePointOfTotal = div(allocPoint, totalAllocPoint);
              if (poolSharePointOfTotal.isZero()) return;
              // 풀의 총 리워드 일년 할당량(USD)
              const poolShareRewardValueOfTotalInOneYear = mul(totalRewardPriceInOneYear, poolSharePointOfTotal);
              // 풀의 APR
              const poolApr = isNull(poolLiquidityValue)
                ? null
                : mul(div(poolShareRewardValueOfTotalInOneYear, poolLiquidityValue), 100);

              await this.updateMasterChefPool(
                pid,
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

  async smartChefPools() {
    try {
      const smartChefs = await PancakeSwap.getSmartChefs();
      const chunks = toSplitWithReturnSize(smartChefs, 10);

      for (let i = 0; i < chunks.length; i += 1) {
        const transaction = await sequelize.transaction();

        try {
          await Promise.all(
            chunks[i].map(async ({ id, stakeToken, earnToken, reward, endBlock }) => {
              const pool = await this.getRegisteredSmartChefPool(id);
              const curBlockNumber = await PancakeSwap.getBlockNumber();

              if (!isNull(pool) && isGreaterThanOrEqual(curBlockNumber, endBlock)) {
                await this.deactivateMasterChefPool(id, transaction);
                return;
              }

              if (isNull(pool)) {
                await this.initSmartChefPool(
                  {
                    address: id,
                    stakeToken,
                    rewardToken: earnToken,
                  },
                  transaction,
                );
              }

              const { stakeToken: targetStakeToken, rewardToken: targetRewardToken } =
                await this.getRegisteredSmartChefPool(id, transaction);

              /* 풀 총 공급량 */
              const poolLiquidityAmount = divideDecimals(
                (await getTokenBalance(PancakeSwap.provider, targetStakeToken.address, id)).toString(),
                targetStakeToken.decimals,
              );

              /* 풀의 총 유동량(USD) */
              const poolLiquidityValue = isNull(targetStakeToken.price_usd)
                ? null
                : toFixed(mul(poolLiquidityAmount, targetStakeToken.price_usd));
              // 블록 당 리워드 갯수
              const rewardsInOneBlock = reward;
              // 하루 총 생성 블록 갯수
              const blocksInOneDay = div(oneDaySeconds, PancakeSwap.network.block_time_sec);
              // 일년 총 생성 블록 갯수
              const blocksInOneYear = mul(blocksInOneDay, oneYearDays);
              // 하루 총 리워드 갯수
              const totalRewardInOneDay = mul(rewardsInOneBlock, blocksInOneDay);
              // 일년 총 리워드 갯수
              const totalRewardInOneYear = mul(totalRewardInOneDay, oneYearDays);
              // 하루 총 리워드 USD 가격
              const totalRewardPriceInOneDay = isNull(targetRewardToken.price_usd)
                ? null
                : mul(totalRewardInOneDay, targetRewardToken.price_usd);
              // 일년 총 리워드 USD 가격
              const totalRewardPriceInOneYear = isNull(totalRewardPriceInOneDay)
                ? null
                : mul(totalRewardPriceInOneDay, oneYearDays);

              const poolApr =
                isNull(poolLiquidityValue) || isNull(totalRewardPriceInOneYear)
                  ? null
                  : mul(div(totalRewardPriceInOneYear, poolLiquidityValue), 100);

              await this.updateSmartChefPool(
                id,
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
        // }
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async run() {
    await Promise.all([this.masterChefPools(), this.smartChefPools()]);
  }
}

(async () => {
  const pancakeSwap = new PancakeSwapScheduler();
  await pancakeSwap.init();
  await pancakeSwap.run();
})();

// export default new PancakeSwapScheduler();
