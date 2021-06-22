import { Base, IProject, Project } from '../projects';
import { isNull } from '../../utils/typeHelper';
import { getUniswapV2User } from '../../subgraph';
import { ethMainProvider } from '../../utils/testProvider/ethProvider';
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

  addLiquidity(
    token0Address: string,
    token1Address: string,
    amount0Desired: BigNumber,
    amount1Desired: BigNumber,
    amount0Min: BigNumber,
    amount1Min: BigNumber,
    toAddress: string,
    deadline: BigNumber,
  ) {
    const uniswapV2Router02 = this.getUniswapV2Router02Instance();
    return uniswapV2Router02.addLiquidity(
      token0Address,
      token1Address,
      amount0Desired,
      amount1Desired,
      amount0Min,
      amount1Min,
      toAddress,
      deadline,
    );
  }

  async getUserPositions(userAddress: string) {
    const userQuery = await getUniswapV2User({ userAddress });
    const { user } = userQuery.data;

    let liquidityPositions = [];
    if (!isNull(user)) {
      ({ liquidityPositions } = user);
    }

    return liquidityPositions;
  }
}

(async () => {
  const uniswapV2 = new UniswapV2({ provider: ethMainProvider, project: Project[1] });

  // 0xd90177fd58222eea2e2db63c452afebebc3a51ea
  const info = await uniswapV2.getUserPositions('0xd90177fd58222eea2e2db63c452afebebc3a51ea');
  console.log(info);
})();
