import { ethers } from 'ethers';
import Service from './service';
import ERC20Service from './erc20.service';
import NetworkService, { NetworkExtendsAttributes } from './network.service';
import TokenService, { TokenExtendsAttributes } from './token.service';
import MultiTokenService, { MultiTokenExtendsAttributes } from './multiToken.service';
import { ConstantHelper, ArrayHelper } from '../helper';

const NAME = 'WalletService';

class WalletService extends Service {
  name = NAME;
  networks = new Map<number, NetworkExtendsAttributes>();

  tokens = new Map<number, TokenExtendsAttributes>();
  multiTokens = new Map<number, MultiTokenExtendsAttributes>();

  async init() {
    const [networks, tokens, multiTokens] = await Promise.all([
      NetworkService.findAll(),
      TokenService.findAll(),
      MultiTokenService.findAll(),
    ]);

    tokens.forEach((token: TokenExtendsAttributes) => {
      this.tokens.set(token.id, token);
    });

    multiTokens.forEach((multiToken: MultiTokenExtendsAttributes) => {
      this.multiTokens.set(multiToken.id, multiToken);
    });

    networks.forEach((network: NetworkExtendsAttributes) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      this.networks.set(network.id, {
        ...network,
        provider,
      });
    });
  }

  async getBalance(chainId: number | string, contractAddress: string, walletAddress: string, withInfo: boolean = true) {
    const targetNetwork = await NetworkService.findOne({ chainId });
    const targetProvider = this.networks.get(targetNetwork.id).provider;

    const balance =
      contractAddress === ConstantHelper.zeroAddress
        ? await targetProvider.getBalance(walletAddress)
        : await ERC20Service.getBalance(targetProvider, contractAddress, walletAddress);

    if (withInfo) {
      const targetToken = await TokenService.findOne({ network_id: targetNetwork.id, address: contractAddress });
      return { balance, ...targetToken };
    }

    return { balance };
  }

  async getTotalBalance(
    walletAddress: string,
    options: { withInfo?: boolean; hasBalance?: boolean } = { withInfo: true, hasBalance: true },
  ) {
    const tokens = await TokenService.findAll();

    const totalBalances = await Promise.all(
      tokens.map(async (token: TokenExtendsAttributes) => {
        return this.getBalance(token.Network.chainId, token.address, walletAddress, options.withInfo);
      }),
    );

    return options.hasBalance ? ArrayHelper.findGreaterThanZeroBalance(totalBalances) : totalBalances;
  }
}

export default new WalletService();