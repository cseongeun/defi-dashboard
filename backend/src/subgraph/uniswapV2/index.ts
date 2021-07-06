import { UniswapV2ETHPriceQuery, UniswapV2PairQuery, UniswapV2TokenPriceQuery, UniswapV2UserQuery } from './query';
import axios from 'axios';

class UniswapV2Subgraph {
  url: any;

  constructor() {
    this.url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
  }

  async getEtherPriceInUSD() {
    const result = await axios.post(this.url, { query: UniswapV2ETHPriceQuery });
    return result?.data?.data?.bundle?.ethPrice;
  }

  async getLiquidityPositions(userAddress: string) {
    const result = await axios.post(this.url, {
      query: UniswapV2UserQuery,
      variables: {
        userAddress: userAddress.toLowerCase(),
      },
    });

    return result?.data?.data?.user?.liquidityPositions;
  }

  async getTokenPrice(tokenAddress: string) {
    const result = await axios.post(this.url, {
      query: UniswapV2TokenPriceQuery,
      variables: {
        tokenAddress: tokenAddress.toLowerCase(),
      },
    });

    return result?.data?.data?.token?.derivedETH;
  }

  async getPair(pairAddress: string) {
    const result = await axios.post(this.url, {
      query: UniswapV2PairQuery,
      variables: {
        pairAddress: pairAddress.toLowerCase(),
      },
    });

    return result?.data?.data?.pair;
  }
}

export default new UniswapV2Subgraph();
