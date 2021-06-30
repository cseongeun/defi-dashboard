import Network from '../models/Network';

interface INetwork {
  name: string;
  subName: string;
  chainId: number;
  rpcUrl: string;
}

const networks: INetwork[] = [
  {
    name: 'Ethereum',
    subName: 'Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/a74ce6259ee749228b426a1ca28bfc9b',
  },
  {
    name: 'BinanceSmartChain',
    subName: 'Mainnet',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  },
];

(async () => {
  networks.forEach(async (network) => {
    await Network.create(network);
  });
})();
