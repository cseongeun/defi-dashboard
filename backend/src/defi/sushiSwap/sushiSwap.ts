import { Contract, ethers } from 'ethers';
import { ContractService, ProtocolService, TokenService } from '../../service';
import { MASTER_CHEF_ADDRESS, SUSHI_TOKEN_ADDRESS, POOL_TYPE } from './constant';
import SushiSwapSubgraph from '../../subgraph/sushiSwap';

class SushiSwap {
  name: string = 'SushiSwap';
  protocol: any;
  network: any;
  provider: any;

  masterChef: Contract;
  sushiToken: any;

  constants: { [key: string]: any } = {
    masterChefAddress: MASTER_CHEF_ADDRESS,
    sushiTokenAddress: SUSHI_TOKEN_ADDRESS,
    poolType: POOL_TYPE,
  };

  async init() {
    const [protocol, masterChefAbi, sushiToken] = await Promise.all([
      ProtocolService.findOne({ name: this.name }),
      ContractService.findOne({ address: this.constants.masterChefAddress }),
      TokenService.findOne({ address: this.constants.sushiTokenAddress }),
    ]);

    this.protocol = protocol;
    this.sushiToken = sushiToken;
    this.network = this.protocol.Network;
    this.provider = new ethers.providers.JsonRpcProvider(this.network.rpc_url);
    this.masterChef = new ethers.Contract(this.constants.masterChefAddress, masterChefAbi.data, this.provider);
  }

  async getTotalAllocPoint() {
    return await this.masterChef.totalAllocPoint();
  }

  async getSushiPerBlock() {
    return await this.masterChef.sushiPerBlock();
  }

  async getPoolLength() {
    return await this.masterChef.poolLength();
  }

  async getPoolInfo(pid: number) {
    return await this.masterChef.poolInfo(pid);
  }

  async getPair(address: string) {
    return SushiSwapSubgraph.getPair(address);
  }
}

export default new SushiSwap();
