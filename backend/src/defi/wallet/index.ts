import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

import { ZERO_ADDRESS } from '../../helper/constant.helper';
import { TokenAbi } from '../../helper/token.helper';
import { findGreaterThanZeroBalance } from '../../helper/array.helper';
import { NetworkExtendsAttributes, TokenExtendsAttributes, BalanceAttributes } from './interface';
import tokenService from '../../service/token.service';

class Wallet {
  tokens: TokenExtendsAttributes[];
  tokenByAddress = new Map<string, TokenExtendsAttributes>();
  providerByChainId = new Map<number | string, Provider>();

  constructor(networks: NetworkExtendsAttributes[], tokens: TokenExtendsAttributes[]) {
    this.tokens = tokens;

    tokens.forEach((token: TokenExtendsAttributes) => {
      this.tokenByAddress.set(token.address, token);
    });

    networks.forEach((network: NetworkExtendsAttributes) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      this.providerByChainId.set(network.chainId, provider);
    });
  }

  async getBalance(chainId: number | string, contractAddress: string, walletAddress: string, withInfo: boolean = true) {
    const targetProvider = this.providerByChainId.get(chainId);

    const balance =
      contractAddress === ZERO_ADDRESS
        ? await targetProvider.getBalance(walletAddress)
        : await new ethers.Contract(contractAddress, TokenAbi, targetProvider).balanceOf(walletAddress);

    // console.log(chainId);
    // console.log(balance);
    return withInfo ? { balance, ...this.tokenByAddress.get(contractAddress) } : { balance };
  }

  async getTotalBalance(walletAddress: string, withInfo: boolean = true, hasBalance: boolean = true) {
    const totalBalances = await Promise.all(
      this.tokens.map(async (token) => {
        console.log('token', token);
        return await this.getBalance(token.Network.chainId, token.address, walletAddress, withInfo);
      }),
    );

    return hasBalance ? findGreaterThanZeroBalance(totalBalances) : totalBalances;
  }
}

export default Wallet;
