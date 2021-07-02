import { Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import Service from './service';
import AbiService from './abi.service';
import { ConstantHelper } from '../helper';

const NAME = 'ERC20Service';

class ERC20Service extends Service {
  name = NAME;
  erc20Abi: any;

  async init() {
    const { data } = await AbiService.findOne({ address: ConstantHelper.standardERC20Address });
    this.erc20Abi = data;
  }

  async getTotalSupply(provider: Provider, tokenAddress: string) {
    return await new ethers.Contract(tokenAddress, this.erc20Abi, provider).totalSupply();
  }

  async getBalance(provider: Provider, tokenAddress: string, userAddress: string) {
    return await new ethers.Contract(tokenAddress, this.erc20Abi, provider).balanceOf(userAddress);
  }
}

export default new ERC20Service();
