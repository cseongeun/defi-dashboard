import { PancakeSwapV2PairQuery } from './query';
import axios from 'axios';

class PancakeSwapV2Subgraph {
  pairUrl: string;

  constructor() {
    this.pairUrl = 'https://api.thegraph.com/subgraphs/name/pancakeswap/pairs';
  }

  async getPair(pairAddress: string) {
    const result = await axios.post(this.pairUrl, {
      query: PancakeSwapV2PairQuery,
      variables: {
        pairAddress: pairAddress.toLowerCase(),
      },
    });

    return result?.data?.data?.pair;
  }
}

export default new PancakeSwapV2Subgraph();
