import { BigNumber, Contract, ethers } from 'ethers';

import { Base, IProject, Project } from '../projects';
import { isNull } from '../../utils/typeHelper';
import { getUniswapV2LiquidityPositions } from '../../subgraph';

export class PancakeBunny extends Base {
  constructor({ provider, project }: { provider: any; project: IProject }) {
    super({ provider, project });
  }

  async getUserPositions(userAddress: string) {
    
  }
}
