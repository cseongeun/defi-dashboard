import { ethers } from 'ethers';

const ethMainnet = 'https://mainnet.infura.io/v3/e61f5cbfc85d41aeb9dc46bfe3d03110';

export const ethMainProvider = ()  => {
	return new ethers.providers.JsonRpcProvider(ethMainnet);
}