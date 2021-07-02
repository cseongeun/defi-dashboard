import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import Scheduler from './scheduler';
import {
  NetworkService,
  NetworkAttributes,
  TokenService,
  MultiTokenService,
  MultiTokenExtendsAttributes,
  ChainLinkService,
  ERC20Service,
} from '../service';
import { TypeHelper, DecimalsHelper, BigNumberHelper } from '../helper';
import { TokenAttributes } from '../models/Token';

class TokenPriceScheduler extends Scheduler {
  name: string = 'TOKEN_PRICE';

  networks: NetworkAttributes[];
  providers = new Map<number, Provider>();

  async init() {
    this.networks = await NetworkService.findAll();
    this.networks.forEach((network) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      this.providers.set(network.id, provider);
    });
  }

  async getSingleTokens() {
    return TokenService.findAll();
  }

  async getMultiTokens() {
    return MultiTokenService.findAll();
  }

  async updateSingleTokenPrice(id: number, price: string) {
    return TokenService.update({ id }, { price_usd: price });
  }

  async updateMultiTokenPrice(id: number, price: string) {
    return MultiTokenService.update({ id }, { price_usd: price });
  }

  async runSingleTokens() {
    const singleTokens: TokenAttributes[] = await this.getSingleTokens();
    return Promise.all(
      singleTokens.map(async ({ id, network_id, price_decimals, price_address }) => {
        if (TypeHelper.isNull(price_address)) return;
        const targetProvider = this.providers.get(network_id);
        const priceInChainLink = await ChainLinkService.getPrice(targetProvider, price_address);
        const priceUSD = DecimalsHelper.divideDecimals(priceInChainLink.toString(), price_decimals);
        this.updateSingleTokenPrice(id, priceUSD.toString());
      }),
    );
  }

  async runMultiTokens() {
    const multiTokens: MultiTokenExtendsAttributes[] = await this.getMultiTokens();
    return Promise.all(
      multiTokens.map(async ({ id, network_id, address, decimals, pair0, pair1 }) => {
        if (TypeHelper.isNull(pair0) || TypeHelper.isNull(pair1)) return;

        const targetProvider = this.providers.get(network_id);

        const [pair0Price, pair1Price] = [pair0.price_usd, pair1.price_usd];
        const targetPair = !TypeHelper.isNull(pair0Price) ? pair0 : !TypeHelper.isNull(pair1Price) ? pair1 : null;
        if (TypeHelper.isNull(targetPair)) return;

        // multi token price = (price of pair x * balance of pair x) * 2 / totalSupply
        const totalSupply = DecimalsHelper.divideDecimals(
          (await ERC20Service.getTotalSupply(targetProvider, address)).toString(),
          decimals,
        );
        const targetPairBalance = DecimalsHelper.divideDecimals(
          (await ERC20Service.getBalance(targetProvider, targetPair.address, address)).toString(),
          targetPair.decimals,
        );
        const targetPairTotalPriceUSD = BigNumberHelper.mul(targetPair.price_usd, targetPairBalance);
        const totalPriceUSD = BigNumberHelper.mul(targetPairTotalPriceUSD, 2);
        const perPriceUSD = BigNumberHelper.div(totalPriceUSD, totalSupply);
        this.updateMultiTokenPrice(id, perPriceUSD.toString());
      }),
    );
  }

  async run() {
    return Promise.all([this.runSingleTokens(), this.runMultiTokens()]);
  }
}

export default new TokenPriceScheduler();
