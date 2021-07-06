import Wallet from './wallet';

describe('Wallet', () => {
  beforeAll(async () => {
    await Wallet.init();
  });

  it('getTotalBalance', async () => {
    const totalBalances = await Wallet.getTotalBalance('0xbe0eb53f46cd790cd13851d5eff43d12404d33e8', {
      hasBalance: false,
    });
    console.log(totalBalances);
  });
});
