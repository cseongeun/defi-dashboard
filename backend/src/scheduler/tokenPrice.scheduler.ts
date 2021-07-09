import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import Scheduler from './scheduler';
import { NetworkService, NetworkAttributes, TokenService, TokenType, TokenExtendsAttributes } from '../service';
import { isNull } from '../helper/type.helper';
import { divideDecimals } from '../helper/decimals.helper';
import { getTokenTotalSupply, getTokenBalance } from '../helper/erc20.helper';
import { mul, div, toFixed } from '../helper/bignumber.helper';
import { getPrice } from '../helper/chainLink.helper';
import { Op } from 'sequelize';

class TokenPriceScheduler extends Scheduler {
  name: string = 'TokenPriceScheduler';

  networks: NetworkAttributes[];
  providers = new Map<number, Provider>();

  async init() {
    this.networks = await NetworkService.findAll();
    this.networks.forEach((network) => {
      const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
      this.providers.set(network.id, provider);
    });
  }

  async getSingleTokensHasPriceAddress() {
    return TokenService.findAll({ type: TokenType.SINGLE, price_address: { [Op.ne]: null } });
  }

  async getSingleTokensNoPriceAddress() {
    return TokenService.findAll({ type: TokenType.SINGLE, price_address: { [Op.eq]: null } });
  }

  async getMultiTokens() {
    return TokenService.findAll({ type: TokenType.MULTI });
  }

  async getMultiTokenComposedOfTarget(id: number) {
    return TokenService.findOne({
      type: TokenType.MULTI,
      price_usd: { [Op.ne]: null },
      [Op.or]: [
        {
          pair0_token_id: id,
        },
        {
          pair1_token_id: id,
        },
      ],
    });
  }

  async updateTokenPrice(id: number, price: string) {
    return TokenService.update({ id }, { price_usd: price });
  }

  async runSingleTokensHasPriceAddress() {
    const singleTokens: TokenExtendsAttributes[] = await this.getSingleTokensHasPriceAddress();
    return Promise.all(
      singleTokens.map(async ({ id, network_id, price_decimals, price_address }) => {
        if (isNull(price_address)) return;
        const targetProvider = this.providers.get(network_id);
        const priceInChainLink = await getPrice(targetProvider, price_address);
        const priceUSD = toFixed(divideDecimals(priceInChainLink.toString(), price_decimals));
        this.updateTokenPrice(id, priceUSD.toString());
      }),
    );
  }

  async runSingleTokensNoPriceAddress() {
    const singleTokens: TokenExtendsAttributes[] = await this.getSingleTokensNoPriceAddress();
    return Promise.all(
      singleTokens.map(async ({ id, network_id, address, decimals }) => {
        const pair = await this.getMultiTokenComposedOfTarget(id);
        if (isNull(pair)) return;

        const anotherToken = pair.pair0.id === id ? pair.pair1 : pair.pair0;

        const targetProvider = this.providers.get(network_id);

        const targetTokenBalanceInPair = divideDecimals(
          (await getTokenBalance(targetProvider, address, pair.address)).toString(),
          decimals,
        );

        const anotherTokenBalanceInPair = divideDecimals(
          (await getTokenBalance(targetProvider, anotherToken.address, pair.address)).toString(),
          anotherToken.decimals,
        );

        const anotherTokenValueInPair = mul(anotherTokenBalanceInPair, anotherToken.price_usd);
        const targetTokenPriceUSD = toFixed(div(anotherTokenValueInPair, targetTokenBalanceInPair));

        this.updateTokenPrice(id, targetTokenPriceUSD.toString());
      }),
    );
  }

  async runMultiTokens() {
    const multiTokens: TokenExtendsAttributes[] = await this.getMultiTokens();
    return Promise.all(
      multiTokens.map(async ({ id, network_id, address, decimals, pair0, pair1 }) => {
        if (isNull(pair0) || isNull(pair1)) return;

        const targetProvider = this.providers.get(network_id);

        const [pair0Price, pair1Price] = [pair0.price_usd, pair1.price_usd];
        const targetPair = !isNull(pair0Price) ? pair0 : !isNull(pair1Price) ? pair1 : null;
        if (isNull(targetPair)) return;

        // "https://dailydefi.org/articles/lp-token-value-calculation/"
        // multi token price = (price of pair x * balance of pair x) * 2 / totalSupply
        const totalSupply = divideDecimals((await getTokenTotalSupply(targetProvider, address)).toString(), decimals);
        const targetPairBalance = divideDecimals(
          (await getTokenBalance(targetProvider, targetPair.address, address)).toString(),
          targetPair.decimals,
        );
        const targetPairTotalPriceUSD = mul(targetPair.price_usd, targetPairBalance);
        const totalPriceUSD = mul(targetPairTotalPriceUSD, 2);
        const perPriceUSD = toFixed(div(totalPriceUSD, totalSupply));
        this.updateTokenPrice(id, perPriceUSD.toString());
      }),
    );
  }

  async run() {
    try {
      console.log('Run Token Price Scheduler');
      /*
      순차적으로 가격 업데이트 진행해야함. 
        - 단일 토큰 가격 업데이트 (체인링크)
        - 단일 토큰이 포함된 페어의 가격 업데이트 (유동성 풀)
        - 페어의 다른 단일 토큰 가격 업데이트 (체인링크 - 유동성 풀 가격으로 산출 된 값)
      */
      await this.runSingleTokensHasPriceAddress();
      await this.runMultiTokens();
      await this.runSingleTokensNoPriceAddress();
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new TokenPriceScheduler();

// (async () => {
//   const tokenPriceScheduler = new TokenPriceScheduler();
//   await tokenPriceScheduler.init();
//   await tokenPriceScheduler.run();
// })();
