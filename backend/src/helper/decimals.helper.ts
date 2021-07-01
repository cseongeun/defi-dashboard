import BigNumberHelper from './bignumber.helper';

class DecimalsHelper {
  multiplyDecimals(value: string | number, decimals: number) {
    return BigNumberHelper.shift(value, decimals);
  }

  divideDecimals(value: string | number, decimals: number) {
    return BigNumberHelper.shift(value, decimals * -1);
  }
}

export default new DecimalsHelper();
