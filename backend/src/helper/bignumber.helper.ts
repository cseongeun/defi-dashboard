import BigNumber from 'bignumber.js';

type argumentType = string | number | BigNumber;

class BigNumberHelper {
  toBigNumber(value: string | number) {
    return new BigNumber(value);
  }

  shift(value: argumentType, n: number) {
    return new BigNumber(value).shiftedBy(n);
  }

  add(a: argumentType, b: argumentType) {
    return new BigNumber(a).plus(b);
  }

  sub(a: argumentType, b: argumentType) {
    return new BigNumber(a).minus(b);
  }

  mul(a: argumentType, b: argumentType) {
    return new BigNumber(a).multipliedBy(b);
  }

  div(a: argumentType, b: argumentType) {
    return new BigNumber(a).div(b);
  }
}

export default new BigNumberHelper();
