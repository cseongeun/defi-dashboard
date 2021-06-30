import fetch from 'cross-fetch';
import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';

import { BlockNumberQuery } from './query';
class BlockSubgraph {
  client: any;

  constructor() {
    this.client = new ApolloClient({
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
  }

  async getBlockNumber() {
    const result = await this.client.query({
      query: BlockNumberQuery,
    });
    return result?.data?.blocks?.[0]?.number;
  }
}

const blockSubgraph = new BlockSubgraph();

export default blockSubgraph;
