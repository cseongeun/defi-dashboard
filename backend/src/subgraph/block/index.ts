import fetch from 'cross-fetch';
import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';

import { BlockNumberQuery } from './query';
class BlockSubgraph {
  etherClient: any;
  bscClient: any;

  constructor() {
    this.etherClient = new ApolloClient({
      link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks', fetch }),
      cache: new InMemoryCache(),
      queryDeduplication: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      },
    });

    this.bscClient = new ApolloClient({
      link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks', fetch }),
      cache: new InMemoryCache(),
      queryDeduplication: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      },
    });
  }

  async getETHBlockNumber() {
    const result = await this.etherClient.query({
      query: BlockNumberQuery,
    });
    return result?.data?.blocks?.[0]?.number;
  }

  async getBSCBlockNumber() {
    const result = await this.bscClient.query({
      query: BlockNumberQuery,
    });
    return result?.data?.blocks?.[0]?.number;
  }
}

const blockSubgraph = new BlockSubgraph();

export default blockSubgraph;
