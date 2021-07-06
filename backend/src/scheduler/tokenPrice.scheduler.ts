import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import Scheduler from './scheduler';
import { NetworkService, NetworkAttributes, TokenService, TokenType } from '../service';
import { isNull } from '../helper/type.helper';
import { divideDecimals } from '../helper/decimals.helper';
import { getPrice } from '../helper/chainLink.helper';
import { TokenAttributes } from '../model/Token';

class TokenPriceScheduler extends Scheduler {
  name: string = 'TokenPriceScheduler';

  networks: NetworkAttributes[];
  providers = new Map<number, Provider>();

  async init() {
    this.networks = await NetworkService.findAll();
    this.networks.forEach((network) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      this.providers.set(network.id, provider);
    });
  }

  async getSingleWithChainLinkFee() {
    return TokenService.findAll({ type: TokenType.SINGLE });
  }

  async updateSingleTokenPrice(id: number, price: string) {
    return TokenService.update({ id }, { price_usd: price });
  }

  async runSingleTokens() {
    const singleTokens: TokenAttributes[] = await this.getSingleTokens();
    return Promise.all(
      singleTokens.map(async ({ id, network_id, price_decimals, price_address }) => {
        if (isNull(price_address)) return;
        const targetProvider = this.providers.get(network_id);
        const priceInChainLink = await getPrice(targetProvider, price_address);
        const priceUSD = divideDecimals(priceInChainLink.toString(), price_decimals);
        this.updateSingleTokenPrice(id, priceUSD.toString());
      }),
    );
  }

  async runMultiTokens() {
    const multiTokens: TokenAttributes = await this.getMultiTokens();
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
    try {
      console.log('Run Token Price Scheduler');
      return Promise.all([this.runSingleTokens()]);
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new TokenPriceScheduler();
