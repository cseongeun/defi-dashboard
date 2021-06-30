import { ethers } from 'ethers';
import { PANCAKE_BUNNY_BSC_DASHBOARD } from './constants';
import { AbiService } from '../../service';

class PancakeBunny {
  provider: any;
  dashboard: any;

  constructor(provider: any) {
    this.provider = provider;

    (async () => {
      this.dashboard = await this.getBscDashBoard();
    })();
  }

  async getBscDashBoard() {
    const bscDashBoardAbi = await AbiService.findOne({ address: PANCAKE_BUNNY_BSC_DASHBOARD });
    return new ethers.Contract(PANCAKE_BUNNY_BSC_DASHBOARD, bscDashBoardAbi.get('data'), this.provider);
  }

  async updatePool(poolAddress: string): Promise<void> {}

  async updatePools(poolAddresses: string[]): Promise<void> {
    poolAddresses.forEach((poolAddress) => this.updatePool(poolAddress));
  }

  async getReward(poolAddress: string, userAddress: string) {
    const poolAbi = await AbiService.findOne({ address: poolAddress });
  }

  async getRewards(poolAddresses: string[], userAddress: string) {
    return Promise.all([poolAddresses.map((poolAddress) => this.getReward(poolAddress, userAddress))]);
  }
}

export default PancakeBunny;
