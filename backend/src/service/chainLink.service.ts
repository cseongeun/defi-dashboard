import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

import Service from './service';
import AbiService from './abi.service';
import { ConstantHelper } from '../helper';

const NAME = 'ChainLinkService';

class ChainLinkService extends Service {
  name = NAME;

  aggregatorV3Abi: any;

  async init() {
    const { data } = await AbiService.findOne({ address: ConstantHelper.standardAggregatorV3Address });
    this.aggregatorV3Abi = data;
  }

  async getPrice(provider: Provider, feedAddress: string) {
    const { 1: answer } = await new ethers.Contract(feedAddress, this.aggregatorV3Abi, provider).latestRoundData();
    return answer;
  }
}

export default new ChainLinkService();
