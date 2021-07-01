import { ZERO_ADDRESS } from '../../helper/constant.helper';
import { DecimalsHelper } from '../../helper';
import { NetworkService, TokenService } from '../../service';
import Wallet from './wallet';

const address = {
  test: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
};

describe('Wallet', () => {
  let wallet;
  beforeAll(async () => {
    const networks = await NetworkService.findAll();
    const tokens = await TokenService.findAll();
    wallet = new Wallet(networks, tokens);
  });

  describe('getBalance', () => {
    describe('ethereum', () => {
      const chainId = 1;
      it('ETH', async () => {
        const balance = await wallet.getBalance(chainId, ZERO_ADDRESS, address.test);
        console.log(balance);
      });
    });
  });
  describe('getTotalBalance', () => {
    it('Total', async () => {
      const balances = await wallet.getTotalBalance(address.test);
      console.log(balances);
    });
  });
});
