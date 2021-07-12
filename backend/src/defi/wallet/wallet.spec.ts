import Wallet from './wallet';
import { ethers } from 'ethers';
describe('Wallet', () => {
  beforeAll(async () => {
    await Wallet.init();
  });

  it('Ethers', async () => {
    const url = 'https://api.octet.build/v2/explorer/ETH/rpc';
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkeCI6NDQzNDUsImdyb3VwSWR4IjoyNjAzMSwidXNlcklkeCI6MjM5MjIsInR5cGUiOiJhcGkiLCJzZXJ2aWNlSWR4IjoyLCJyZXNvdXJjZUlkeCI6NDkxOSwiaWF0IjoxNjI2MDcwMDQ5fQ.3gNdx-lqhL4C9y2i-WCqUsDKiOA_b-yJuCAsreCepEE';
    const provider = new ethers.providers.JsonRpcProvider({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(await provider.getNetwork());

    console.log(await provider.getBalance('0x487cFE95e6De5B98117DfcDaF13A62EA38192Bf7'));
  });

  it('getTotalBalance', async () => {
    const totalBalances = await Wallet.getTotalBalance('0xbe0eb53f46cd790cd13851d5eff43d12404d33e8', {
      hasBalance: false,
    });
    console.log(totalBalances);
  });
});
