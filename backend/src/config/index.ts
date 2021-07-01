import 'dotenv/config';

const config: { [key: string]: any } = {
  DB_HOST: process.env.DB_HOST,
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  ETHEREUM_MAINNET_RPC_URL: process.env.ETHEREUM_MAINNET_RPC_URL,
  BINANCE_SMART_CHAIN_MAINNET_RPC_URL: process.env.BINANCE_SMART_CHAIN_MAINNET_RPC_URL,
  COIN_MARKET_CAP_API_KEY: process.env.COIN_MARKET_CAP_API_KEY,
};

export default config;
