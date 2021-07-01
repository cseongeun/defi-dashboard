import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import BaseScheduler from './base.scheduler';
import { NetworkService, NetworkAttributes, TokenService, TokenType } from '../service';
import { aggregatorV3Abi } from '../helper/chainLink.helper';
import { TypeHelper, DecimalsHelper } from '../helper';

class TokenPriceScheduler extends BaseScheduler {
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
    return TokenService.findAll({ type: TokenType.SINGLE });
  }

  async getMultiTokens() {
    return TokenService.findAll({ type: TokenType.MULTI });
  }

  async updateTokenPrice(id: number, price: string) {
    return TokenService.update({ id }, { price_usd: price });
  }

  async run() {
    const singleTokens = await this.getSingleTokens();
    return Promise.all(
      singleTokens.map(async ({ id, network_id, price_decimals, price_address }) => {
        if (TypeHelper.isNull(price_address)) return;

        const targetProvider = this.providers.get(network_id);
        const { 1: answer } = await new ethers.Contract(price_address, aggregatorV3Abi, targetProvider).lastRoundData();
        const appliedDecimalPrice = DecimalsHelper.divideDecimals(answer.toString(), price_decimals).toString();
        console.log(appliedDecimalPrice);
        await this.updateTokenPrice(id, appliedDecimalPrice);
      }),
    );
  }
}

export default new TokenPriceScheduler();
