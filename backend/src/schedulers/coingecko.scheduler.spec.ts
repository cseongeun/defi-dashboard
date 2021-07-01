import CoingeckoScheduler from './coingecko.scheduler';

describe('CoingeckoScheduler', () => {
  it('getTokens', async () => {
    const res = await CoingeckoScheduler.getTokens();
    console.log(res);
  });
  it('getNetworks', async () => {
    const res = await CoingeckoScheduler.getNetworks();
    console.log(res);
  });
});
