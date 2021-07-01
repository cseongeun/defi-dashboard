import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://docs.chain.link/docs/';
const priceFeed: { [key: string]: string } = {
  ETH: 'ethereum-addresses',
  BNB: 'binance-smart-chain-addresses',
  MATIC: 'matic-addresses',
  xDAI: 'xdai-price-feeds',
  HT: 'huobi-eco-chain-price-feeds',
  AVAX: 'avalanche-price-feeds',
  FTM: 'fantom-price-feeds',
};

const instance = axios.create({
  baseURL: url,
  timeout: 10000,
  responseType: 'json',
});

const getPriceFeedTable = async (symbol: string) => {
  const html = await instance.get(priceFeed[symbol]);
  const $ = cheerio.load(html.data);
  const feedData = $('#feed-data').children('0').children('h2').text();

  console.log(feedData);
};

(async () => {
  getPriceFeedTable('ETH');
})();
