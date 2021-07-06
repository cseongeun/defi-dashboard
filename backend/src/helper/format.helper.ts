import { BigNumber, ethers } from 'ethers';

export const toCommify = (amount: number | string | BigNumber): string => {
  return ethers.utils.commify(amount.toString());
};

