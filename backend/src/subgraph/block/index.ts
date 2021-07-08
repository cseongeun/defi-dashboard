import axios from 'axios';
import { BlockNumberQuery } from './query';

class BlockSubgraph {
  ethereumUrl: string;
  binanceSmartChainUr;

  constructor() {
    this.ethereumUrl = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks';
    this.binanceSmartChainUr = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks';
  }

  async getETHBlockNumber() {
    const result = await axios.post(this.ethereumUrl, {
      query: BlockNumberQuery,
    });
    return result?.data?.data?.blocks?.[0]?.number;
  }

  async getBSCBlockNumber() {
    const result = await axios.post(this.binanceSmartChainUr, {
      query: BlockNumberQuery,
    });
    return result?.data?.data?.blocks?.[0]?.number;
  }
}

export default new BlockSubgraph();
