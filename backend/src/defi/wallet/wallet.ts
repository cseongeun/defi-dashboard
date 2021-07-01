import { ethers } from 'ethers';
import { ConstantHelper, TokenHelper } from '../../helper';
import { findGreaterThanZeroBalance } from '../../helper/array.helper';
import {
  NetworkExtendsAttributes,
  TokenExtendsAttributes,
  BalanceAttributes,
  BalanceExtendsAttributes,
} from './interface';
import { NetworkService, TokenService } from '../../service';

class Wallet {
  tokens = new Map<number, TokenExtendsAttributes>();
  networks = new Map<number, NetworkExtendsAttributes>();

  constructor(networks: NetworkExtendsAttributes[], tokens: TokenExtendsAttributes[]) {
    tokens.forEach((token: TokenExtendsAttributes) => {
      this.tokens.set(token.id, token);
    });

    networks.forEach((network: NetworkExtendsAttributes) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      this.networks.set(network.id, {
        ...network,
        provider,
      });
    });
  }

  async getBalance(
    chainId: number | string,
    contractAddress: string,
    walletAddress: string,
    withInfo: boolean = true,
  ): Promise<BalanceAttributes | BalanceExtendsAttributes> {
    const targetNetwork = await NetworkService.findOne({ chainId });
    const targetProvider = this.networks.get(targetNetwork.id).provider;

    const balance =
      contractAddress === ConstantHelper.zeroAddress()
        ? await targetProvider.getBalance(walletAddress)
        : await new ethers.Contract(contractAddress, TokenHelper.getTokenAbi(), targetProvider).balanceOf(
            walletAddress,
          );

    if (withInfo) {
      const targetToken = await TokenService.findOne({ network_id: targetNetwork.id, address: contractAddress });
      return { balance, ...targetToken };
    }

    return { balance };
  }

  async getTotalBalance(
    walletAddress: string,
    options: { withInfo?: boolean; hasBalance?: boolean } = { withInfo: true, hasBalance: true },
  ): Promise<BalanceAttributes[] | BalanceExtendsAttributes[]> {
    const tokens = await TokenService.findAll();

    const totalBalances = await Promise.all(
      tokens.map(async (token: TokenExtendsAttributes) => {
        return this.getBalance(token.Network.chainId, token.address, walletAddress, options.withInfo);
      }),
    );

    return options.hasBalance ? findGreaterThanZeroBalance(totalBalances) : totalBalances;
  }

  async getWalletPortfolio(walletAddress: string) {}
}

export default Wallet;
