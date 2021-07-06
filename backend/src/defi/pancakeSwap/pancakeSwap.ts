import { Contract, ethers } from 'ethers';
import PancakeSwapV2Subgraph from '../../subgraph/pancakeSwapV2';

import { ProtocolService, ContractService } from '../../service';
import { MASTER_CHEF_ADDRESS, CAKE_TOKEN_ADDRESS } from './constant';

class PancakeSwap {
  name: string = 'PancakeSwap';
  masterChef: Contract;
  protocol: any;
  network: any;
  provider: any;

  constants: { [key: string]: any } = {
    cakeTokenAddress: CAKE_TOKEN_ADDRESS,
    masterChefAddress: MASTER_CHEF_ADDRESS,
  };

  async init() {
    const [protocol, masterChefAbi] = await Promise.all([
      ProtocolService.findOne({ name: this.name }),
      ContractService.findOne({ address: this.constants.masterChefAddress }),
    ]);

    this.protocol = protocol;
    this.network = this.protocol.Network;

    this.provider = new ethers.providers.JsonRpcProvider(this.network.rpcUrl);
    this.masterChef = new ethers.Contract(this.constants.masterChefAddress, masterChefAbi.data, this.provider);
  }

  async getPoolLength() {
    return await this.masterChef.poolLength();
  }
  async getPoolInfo(pid: number) {
    return await this.masterChef.poolInfo(pid);
  }

  async getPair(address: string) {
    return PancakeSwapV2Subgraph.getPair(address);
  }
}

export default new PancakeSwap();
