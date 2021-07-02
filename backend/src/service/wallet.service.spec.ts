import WalletService from './wallet.service';

describe('WalletService', () => {
  const property = {
    networks: {
      ETH: 1,
      BSC: 2,
    },
    token: {},
    multiToken: {},
    address: {},
  };

  beforeAll(async () => {
    await WalletService.init();
  });

  it('getBalance', async () => {
    const balance = await WalletService.getBalance();
  });
});
