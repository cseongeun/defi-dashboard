import { PancakeSwapV2PairQuery, PancakeSwapV2SmartChefFactoryQuery, PancakeSwapV2SmartChefQuery } from './query';
import axios from 'axios';

class PancakeSwapV2Subgraph {
  pairUrl: string;
  smartChefUrl: string;

  constructor() {
    this.pairUrl = 'https://api.thegraph.com/subgraphs/name/pancakeswap/pairs';
    this.smartChefUrl = 'https://api.thegraph.com/subgraphs/name/xtoken1/smartchef';
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

  async getNumOfSmartChefFactory(smartChefFactoryAddress: string) {
    const result = await axios.post(this.smartChefUrl, {
      query: PancakeSwapV2SmartChefFactoryQuery,
      variables: {
        smartChefAddress: smartChefFactoryAddress.toLowerCase(),
      },
    });
    return result?.data?.data?.factory?.totalSmartChef;
  }

  async getSmartChef(limit: number | string) {
    const result = await axios.post(this.smartChefUrl, {
      query: PancakeSwapV2SmartChefQuery,
      variables: {
        limit: Number(limit),
      },
    });
    return result?.data?.data.smartChefs;
  }
}

// (async () => {
//   const pancakeSwapV2Subgraph = new PancakeSwapV2Subgraph();

//   const res = await pancakeSwapV2Subgraph.getNumOfSmartChefFactory('0x927158be21fe3d4da7e96931bb27fd5059a8cbc2');
//   console.log(res);

//   const rr = await pancakeSwapV2Subgraph.getSmartChef(res);
//   console.log(rr);
// })();

export default new PancakeSwapV2Subgraph();
