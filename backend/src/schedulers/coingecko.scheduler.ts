import axios, { AxiosInstance } from 'axios';
import { NetworkService } from '../service';

// API Docs: https://www.coingecko.com/api/documentations/v3

const API = {
  ping: '/ping',
  simple_price: '/simple/price',
  simple_token_price_id: (id: string | number) => `/simple/token_price/${id}`,
  simple_supported_vs_currencies: '/simple/supported_vs_currencies',
  coins_list: '/coins/list',

  asset_platforms: '/asset_platforms',
};

class CoingeckoScheduler {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      timeout: 10000,
      responseType: 'json',
    });
  }

  async getTokens() {
    const { data } = await this.instance.get(API.coins_list, { params: { include_platform: true } });
    return data;
  }

  async getNetworks() {
    const { data } = await this.instance.get(API.asset_platforms);
    return data;
  }

  async updateTokens() {
    const tokens: any[] = await this.getTokens();

    for await (const token of tokens) {
    }
  }

  async updateNetworks() {}
}

export default new CoingeckoScheduler();
