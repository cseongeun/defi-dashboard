import BigNumber from 'bignumber.js';
import { mul, div } from '../../helper/bignumber.helper';
import { isNull } from '../../helper/type.helper';
import { PoolService, STATUS, TokenService, TokenType } from '../../service';

export const getRegisteredPool = async (
  condition: {
    protocol_id: number;
    pid?: number;
    address?: string;
  },
  transaction: any = null,
) => {
  return PoolService.findOne({ ...condition }, { transaction });
};

export const getRegisteredToken = async (
  condition: {
    network_id: number;
    address: string;
  },
  transaction: any = null,
) => {
  return TokenService.findOne({ ...condition }, { transaction });
};

export const registerPool = async (
  params: {
    protocol_id: number;
    name: string;
    type: string;
    address?: string;
    pid?: number;
    stake_token_id: number;
    reward_token_id: number;
  },
  transaction: any = null,
) => {
  return PoolService.create({ ...params, status: STATUS.ACTIVATE }, transaction);
};

export const registerToken = async (
  params: {
    network_id: number;
    type: string;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    pair0_token_id?: number;
    pair1_token_id?: number;
  },
  transaction: any = null,
) => {
  return TokenService.create({ ...params, status: STATUS.ACTIVATE }, transaction);
};

export const updatePool = async (
  condition: {
    protocol_id: number;
    pid?: number;
    address?: string;
  },
  params: {
    liquidity_amount?: string | null;
    liquidity_usd?: string | null;
    apy?: string | null;
    apr?: string | null;
    status?: string;
  },
  transaction: any = null,
) => {
  return PoolService.update({ ...condition }, { ...params }, { transaction });
};

export const updateToken = async (
  condition: {
    id?: number;
    address?: string;
  },
  params: {
    price_usd: string;
  },
  transaction,
) => {
  return TokenService.update({ ...condition }, { ...params }, { transaction });
};

export const deactivatePool = async (
  params: { protocol_id: number; pid?: number; address?: string },
  transaction: any = null,
) => {
  return updatePool(
    { ...params },
    { liquidity_amount: null, liquidity_usd: null, apr: null, apy: null, status: STATUS.DEACTIVATE },
    transaction,
  );
};

export const tokenInit = async (
  token: { network_id: number; address: string; name: string; symbol: string; decimals: number },
  pair: any,
  transaction,
) => {
  const registeredToken = await getRegisteredToken(
    {
      network_id: token.network_id,
      address: token.address,
    },
    transaction,
  );

  // LP 가 아닐 경우,
  if (isNull(pair)) {
    if (isNull(registeredToken)) {
      await registerToken(
        {
          network_id: token.network_id,
          type: TokenType.SINGLE,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          address: token.address,
        },
        transaction,
      );
    }
  }
  // LP 일 경우,
  else {
    const {
      token0: { id: pair0Address, name: pair0Name, symbol: pair0Symbol, decimals: pair0Decimals },
      token1: { id: pair1Address, name: pair1Name, symbol: pair1Symbol, decimals: pair1Decimals },
    } = pair;

    const [registeredPair0, registeredPair1] = await Promise.all([
      getRegisteredToken({ network_id: token.network_id, address: pair0Address }, transaction),
      getRegisteredToken({ network_id: token.network_id, address: pair1Address }, transaction),
    ]);

    if (isNull(registeredPair0)) {
      await registerToken(
        {
          network_id: token.network_id,
          type: TokenType.SINGLE,
          address: pair0Address,
          name: pair0Name,
          symbol: pair0Symbol,
          decimals: pair0Decimals,
        },
        transaction,
      );
    }
    if (isNull(registeredPair1)) {
      await registerToken(
        {
          network_id: token.network_id,
          type: TokenType.SINGLE,
          address: pair1Address,
          name: pair1Name,
          symbol: pair1Symbol,
          decimals: pair1Decimals,
        },
        transaction,
      );
    }
    if (isNull(registeredToken)) {
      const [pair0, pair1] = await Promise.all([
        getRegisteredToken({ network_id: token.network_id, address: pair0Address }, transaction),
        getRegisteredToken({ network_id: token.network_id, address: pair0Address }, transaction),
      ]);
      await registerToken(
        {
          network_id: token.network_id,
          type: TokenType.MULTI,
          address: token.address,
          name: token.name,
          symbol: `${pair0.symbol}-${pair1.symbol}`,
          decimals: token.decimals,
          pair0_token_id: pair0.id,
          pair1_token_id: pair1.id,
        },
        transaction,
      );
    }
  }
};

export const calculateApr = (poolLiquidityUSDValue: BigNumber, poolRewardUSDValueInOneYear: BigNumber) => {
  return isNull(poolLiquidityUSDValue) || isNull(poolRewardUSDValueInOneYear)
    ? null
    : mul(div(poolRewardUSDValueInOneYear, poolLiquidityUSDValue), 100);
};
