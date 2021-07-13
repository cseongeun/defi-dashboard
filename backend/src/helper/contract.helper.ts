import { Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

export const getContract = async (provider: Provider, address: string, abi: any[]) => {
  return new ethers.Contract(address, abi, provider);
};
