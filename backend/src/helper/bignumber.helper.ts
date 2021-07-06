import BigNumber from 'bignumber.js';

type argumentType = string | number | BigNumber;

export const toBigNumber = (value: argumentType) => {
  return new BigNumber(value);
};

export const shift = (value: argumentType, n: number) => {
  return new BigNumber(value).shiftedBy(n);
};

export const add = (a: argumentType, b: argumentType) => {
  return new BigNumber(a).plus(b);
};

export const sub = (a: argumentType, b: argumentType) => {
  return new BigNumber(a).minus(b);
};

export const mul = (a: argumentType, b: argumentType) => {
  return new BigNumber(a).multipliedBy(b);
};

export const div = (a: argumentType, b: argumentType) => {
  return new BigNumber(a).div(b);
};
