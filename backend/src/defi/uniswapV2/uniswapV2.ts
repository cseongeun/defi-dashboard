import { isNull } from '../../helper/type.helper';
import { uniswapV2ERC20ABI, uniswapV2FactoryABI, uniswapV2PairABI, uniswapV2Router02ABI } from './abi';
import { uniswapV2FactoryAddress, uniswapV2Router02Address } from './addresses';
import { BigNumber, Contract, ethers } from 'ethers';

import { uniswapSubgraph } from '../../subgraph';

export class UniswapV2 {
  provider: any;

  constructor(config) {
    this.provider = config;
  }

  getUniswapV2FactoryInstance(): Contract {
    return new ethers.Contract(uniswapV2FactoryAddress, uniswapV2FactoryABI, this.provider);
  }

  getUniswapV2Router02Instance(): Contract {
    return new ethers.Contract(uniswapV2Router02Address, uniswapV2Router02ABI, this.provider);
  }

  async getUserPositions(userAddress: string) {
    const userQuery = await uniswapSubgraph.getLiquidityPositions(userAddress);
    const { user } = userQuery.data;

    let liquidityPositions = [];
    if (!isNull(user)) {
      ({ liquidityPositions } = user);
    }

    return liquidityPositions;
  }
}
