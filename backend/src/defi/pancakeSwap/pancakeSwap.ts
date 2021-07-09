import { Contract, ethers } from 'ethers';
import BlockSubgraph from '../../subgraph/block';
import PancakeSwapV2Subgraph from '../../subgraph/pancakeSwapV2';
import { ProtocolService, ContractService } from '../../service';
import { MASTER_CHEF_ADDRESS, CAKE_TOKEN_ADDRESS, SMART_CHEF_ADDRESS, POOL_TYPE, SMART_CHEF_ABI } from './constant';

class PancakeSwap {
  name: string = 'PancakeSwap';
  masterChef: Contract;
  protocol: any;
  network: any;
  provider: any;

  constants: { [key: string]: any } = {
    cakeTokenAddress: CAKE_TOKEN_ADDRESS,
    masterChefAddress: MASTER_CHEF_ADDRESS,
    smartChefAddress: SMART_CHEF_ADDRESS,
    poolType: POOL_TYPE,
  };

  async init() {
    const [protocol, masterChefAbi] = await Promise.all([
      ProtocolService.findOne({ name: this.name }),
      ContractService.findOne({ address: this.constants.masterChefAddress }),
    ]);

    this.protocol = protocol;
    this.network = this.protocol.Network;
    this.provider = new ethers.providers.JsonRpcProvider(this.network.rpc_url);
    this.masterChef = new ethers.Contract(this.constants.masterChefAddress, masterChefAbi.data, this.provider);
  }

  async getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  async getTotalAllocPoint() {
    return await this.masterChef.totalAllocPoint();
  }

  async getCakePerBlock() {
    return await this.masterChef.cakePerBlock();
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

  async getSmartChefsInfo() {
    const numOfSmartChefs = await PancakeSwapV2Subgraph.getNumOfSmartChefFactory(this.constants.smartChefAddress);
    return PancakeSwapV2Subgraph.getSmartChef(numOfSmartChefs);
  }

  async getSmartChefInstance(address: string) {
    return new ethers.Contract(address, SMART_CHEF_ABI, this.provider);
  }
}

export default new PancakeSwap();
