import { Contract, ethers } from 'ethers';

export const getContract = (provider: any, address: string, abi: any): Contract => {
	return new ethers.Contract(address, abi, provider); 
}
