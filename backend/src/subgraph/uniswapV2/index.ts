import fetch from 'cross-fetch';
import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';
import { UniswapV2ETHPriceQuery, UniswapV2PairQuery, UniswapV2TokenPriceQuery, UniswapV2UserQuery } from './query';

class UniswapV2Subgraph {
  client: any;

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', fetch }),
      cache: new InMemoryCache(),
      queryDeduplication: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    });
  }

  async query(params: any) {
    return this.client.query(params);
  }

  async getEtherPriceInUSD() {
    const result = await this.query({
      query: UniswapV2ETHPriceQuery,
    });
    return result?.data?.bundle?.ethPrice;
  }

  async getLiquidityPositions(userAddress: string) {
    const result = await this.query({
      query: UniswapV2UserQuery,
      variables: {
        userAddress,
      },
    });
    return result?.data?.user?.liquidityPositions;
  }

  async getTokenPrice(tokenAddress: string) {
    const result = await this.query({
      query: UniswapV2TokenPriceQuery,
      variables: {
        tokenAddress: tokenAddress.toLowerCase(),
      },
    });
    return result?.data?.token?.derivedETH;
  }

  async getPair(pairAddress: string) {
    const result = await this.query({
      query: UniswapV2PairQuery,
      variables: {
        pairAddress: pairAddress.toLowerCase(),
      },
    });
    return result?.data?.pair;
  }
}

const uniswapV2Subgraph = new UniswapV2Subgraph();

export default uniswapV2Subgraph;
