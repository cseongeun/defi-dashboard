import { toCheckSumAddress } from './address.helper';

describe('AddressHelper', () => {
  describe('toCheckSumAddress', () => {
    it('view', async () => {
      0x58f876857a02d6762e0101bb5c46a8c1ed44dc16;
      const address = '0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF';
      const res = toCheckSumAddress(address);
      console.log(res);
    });
  });
});
