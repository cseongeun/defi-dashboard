import { PoolService, STATUS, TokenService } from '../../service';

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
