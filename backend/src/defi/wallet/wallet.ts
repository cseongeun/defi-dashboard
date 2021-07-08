import { ethers } from 'ethers';
import { TokenService, NetworkService, NetworkExtendsAttributes, TokenExtendsAttributes } from '../../service';
import { findGreaterThanZeroBalance } from '../../helper/array.helper';
import { getTokenBalance } from '../../helper/erc20.helper';
import { zeroAddress } from '../../helper/constant.helper';

class Wallet {
  networks = new Map<number, NetworkExtendsAttributes>();
  tokens = new Map<number, TokenExtendsAttributes>();

  async init() {
    const [networks, tokens] = await Promise.all([NetworkService.findAll(), TokenService.findAll()]);
    console.log(tokens);
    tokens.forEach((token: TokenExtendsAttributes) => {
      this.tokens.set(token.id, token);
    });

    networks.forEach((network: NetworkExtendsAttributes) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
      this.networks.set(network.id, {
        ...network,
        provider,
      });
    });
  }

  async getBalance(networkId: number, contractAddress: string, walletAddress: string) {
    const targetProvider = this.networks.get(networkId).provider;

    const balance =
      contractAddress === zeroAddress
        ? await targetProvider.getBalance(walletAddress)
        : await getTokenBalance(targetProvider, contractAddress, walletAddress);
    return balance;
  }

  async getTotalBalance(walletAddress: string, options: { hasBalance?: boolean } = { hasBalance: true }) {
    const totalBalances = await Promise.all(
      Array.from(this.tokens.values()).map(async (token: TokenExtendsAttributes) => {
        const balance = await this.getBalance(token.network_id, token.address, walletAddress);
        return { ...token, balance };
      }),
    );

    return options.hasBalance ? findGreaterThanZeroBalance(totalBalances) : totalBalances;
  }
}

export default new Wallet();
