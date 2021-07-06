import { ethers } from 'ethers';

export const toCheckSumAddress = (address: string): string => {
  return ethers.utils.getAddress(address);
};

export const isAddress = (address: string): boolean => {
  try {
    toCheckSumAddress(address);
    return true;
  } catch (e) {
    return false;
  }
};
