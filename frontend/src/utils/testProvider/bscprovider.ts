import { ethers } from 'ethers';

const bscMainnet = 'https://bsc-dataseed.binance.org/';

export const bscMainProvider = ()  => {
	return new ethers.providers.JsonRpcProvider(bscMainnet);
}