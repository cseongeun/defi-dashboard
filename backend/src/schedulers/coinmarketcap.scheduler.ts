import axios from 'axios';
import config from '../config';

const instance = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com',
  timeout: 10000,
  headers: {
    'X-CMC_PRO_API_KEY': config.COIN_MARKET_CAP_API_KEY,
  },
});

const update = () => {};
