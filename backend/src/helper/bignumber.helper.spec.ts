import { default as BigNumberHelper } from './bignumber.helper';

describe('BigNumberHelper', () => {
  describe('toDecimalPlaces', () => {
    it('to applied decimals', () => {
      const values = [
        BigNumberHelper.toBigNumber(12),
        BigNumberHelper.toBigNumber(1111111),
        BigNumberHelper.toBigNumber(1000000000000000000),
      ];
      const res = values.map((value) => BigNumberHelper.toDecimalPlaces(value, 18).toString());
      console.log(res);
    });
  });
});
