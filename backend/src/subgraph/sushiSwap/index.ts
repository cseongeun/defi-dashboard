import axios from 'axios';
import { SushiSwapPairQuery } from './query';

class SushiSwapSubgraph {
  exchangeUrl: string;

  constructor() {
    this.exchangeUrl = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';
  }

  async getPair(pairAddress: string) {
    const result = await axios.post(this.exchangeUrl, {
      query: SushiSwapPairQuery,
      variables: {
        pairAddress: pairAddress.toLowerCase(),
      },
    });
    return result?.data?.data?.pair;
  }
}

export default new SushiSwapSubgraph();
