import Network from '../models/Network';
import Protocol from '../models/Protocol';

interface IStatus {
  ACTIVATE: string;
  DEACTIVATE: string;
}

const STATUS: IStatus = {
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
};

interface IProtocol {
  network: string;
  name: string;
  symbol: string;
}

const protocols: IProtocol[] = [
  {
    network: 'Ethereum',
    name: 'uniswap',
    symbol: 'UNI',
  },
  {
    network: 'BinanceSmartChain',
    name: 'pancakeSwap',
    symbol: 'CAKE',
  },
  {
    network: 'BinanceSmartChain',
    name: 'pancakeBunny',
    symbol: 'Bunny',
  },
];

(async () => {
  protocols.forEach(async (protocol) => {
    const network = await Network.findOne({ where: { name: protocol.network } });
    await Protocol.create({ ...protocol, network_id: network.get('id'), status: STATUS });
  });
})();
