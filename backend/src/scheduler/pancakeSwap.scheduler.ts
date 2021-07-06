import Scheduler from './scheduler';
import { sequelize, Sequelize } from '../model';
import { PancakeSwap } from '../defi/pancakeSwap';
import { TokenService, PoolService, TokenType, STATUS } from '../service';
import { isNull } from '../helper/type.helper';
import { fillSequenceNumber, toChunkSplit } from '../helper/array.helper';
import { getTokenProperty } from '../helper/erc20.helper';

class PancakeSwapScheduler extends Scheduler {
  name: string = 'PancakeSwapScheduler';

  async init() {
    await PancakeSwap.init();
  }

  async getRegisteredPool(pid: number, transaction: any = null) {
    try {
      return PoolService.findOne({ protocol_id: PancakeSwap.protocol.id, pid }, { transaction });
    } catch (e) {
      console.log('hereerererer', e);
    }
  }

  async getRegisteredToken(address: string, transaction: any = null) {
    return TokenService.findOne({ network_id: PancakeSwap.network.id, address }, { transaction });
  }

  async registerPool() {}

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
    return TokenService.create(
      { network_id: PancakeSwap.network.id, status: STATUS.ACTIVATE, ...params },
      { transaction },
    );
  }

  async updatePools() {
    try {
      const [poolLength, cakeToken] = await Promise.all([
        PancakeSwap.getPoolLength(),
        // TokenService.findOne({ address: PancakeSwap.constants.cakeTokenAddress }),
      ]);

      const pids = fillSequenceNumber(poolLength.toNumber());
      // DataBase 트랜잭션 부하로 인해 5 파트로 나누기
      const [chunk1, chunk2, chunk3, chunk4, chunk5] = toChunkSplit(pids, pids.length / 10);

      await Promise.all(
        chunk1.map(async (pid) => {
          const transaction = await sequelize.transaction();
          try {
            const pool = await this.getRegisteredPool(pid);
            const { 0: lpToken, 1: allocPoint } = await PancakeSwap.getPoolInfo(pid);

            // 등록되지않은 풀 정보
            if (isNull(pool)) {
              const tokenPair = await PancakeSwap.getPair(lpToken);
              const registeredToken = await this.getRegisteredToken(lpToken);
              const { name, symbol, decimals } = await getTokenProperty(PancakeSwap.provider, lpToken);
              /* Multi 타입이 아닐 경우 */
              if (isNull(tokenPair)) {
                if (isNull(registeredToken)) {
                  await this.registerToken(
                    {
                      type: TokenType.SINGLE,
                      name,
                      symbol,
                      decimals,
                      address: lpToken,
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
                  const [newRegisterToken0, newRegisterToken1] = await Promise.all([
                    this.getRegisteredToken(token0Address, transaction),
                    this.getRegisteredToken(token1Address, transaction),
                  ]);
                  await this.registerToken(
                    {
                      type: TokenType.MULTI,
                      address: lpToken,
                      name,
                      symbol,
                      decimals,
                      pair0_token_id: newRegisterToken0.id,
                      pair1_token_id: newRegisterToken1.id,
                    },
                    transaction,
                  );
                }
              }
            } else {
            }
            await transaction.commit();
          } catch (e) {
            console.log(e);
            await transaction.rollback();
          }
        }),
      );
      console.log('here');
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async run() {
    await this.updatePools();
  }
}

// export default new PancakeSwapScheduler();
(async () => {
  const pancakeSwapScheduler = new PancakeSwapScheduler();
  await pancakeSwapScheduler.init();
  await pancakeSwapScheduler.updatePools();
})();
