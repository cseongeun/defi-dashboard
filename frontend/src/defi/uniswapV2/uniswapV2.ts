import { Base, IProject, Project } from '../projects';
import { isNull } from '../../utils/typeHelper';
import { getUniswapV2LiquidityPositions } from '../../subgraph';
import { uniswapV2ERC20ABI, uniswapV2FactoryABI, uniswapV2PairABI, uniswapV2Router02ABI } from './abi';
import { uniswapV2FactoryAddress, uniswapV2Router02Address } from './addresses';
import { BigNumber, Contract, ethers } from 'ethers';

export class UniswapV2 extends Base {
  constructor({ provider, project }: { provider: any; project: IProject }) {
    super({ provider, project });
  }

  getUniswapV2FactoryInstance(): Contract {
    return new ethers.Contract(uniswapV2FactoryAddress, uniswapV2FactoryABI, this.provider);
  }

  getUniswapV2Router02Instance(): Contract {
    return new ethers.Contract(uniswapV2Router02Address, uniswapV2Router02ABI, this.provider);
  }

  async getUserPositions(userAddress: string) {
    const userQuery = await getUniswapV2LiquidityPositions({ userAddress });
    const { user } = userQuery.data;

    let liquidityPositions = [];
    if (!isNull(user)) {
      ({ liquidityPositions } = user);
    }

    return liquidityPositions;
  }
}
