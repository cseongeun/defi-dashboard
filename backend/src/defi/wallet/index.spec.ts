import Network from '../../models/Network';
import Token from '../../models/Token';
import Wallet from './index';

describe('Wallet', () => {
  let wallet;
  beforeAll(async () => {
    const networks = await Network.findAll({ raw: true, nest: true });
    const tokens = await Token.findAll({ include: Network, raw: true, nest: true });
    wallet = new Wallet(networks, tokens);
  });

  // it('getBalances', async () => {
  //   const balances = await wallet.getBalances('0x999f1389f87915fdDBd6C93f00C09277A4Ad3040');
  //   console.log(balances);
  // });

  // it('toekns', async () => {
  //   const balances = await wallet.getAllBalances('0x999f1389f87915fdDBd6C93f00C09277A4Ad3040');
  //   console.log(JSON.stringify(balances));
  // });

  it('toekns', async () => {
    const balances = await wallet.getTotalBalance('0x2aB8c18C6CB1E3cE4E172Dc076887Df4a472c511');
    console.log(balances);
  });
});
