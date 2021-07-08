import BigNumber from 'bignumber.js';

type argumentType = string | number | BigNumber;

export const toBigNumber = (value: argumentType) => {
  return new BigNumber(value.toString());
};

export const isZero = (value: argumentType) => {
  return new BigNumber(value.toString()).isZero();
};

export const toFixed = (value: argumentType, point: number = 8) => {
  return new BigNumber(value.toString()).toFixed(point);
};

export const shift = (value: argumentType, n: number) => {
  return new BigNumber(value.toString()).shiftedBy(n);
};

export const add = (a: argumentType, b: argumentType) => {
  return new BigNumber(a.toString()).plus(b.toString());
};

export const sub = (a: argumentType, b: argumentType) => {
  return new BigNumber(a.toString()).minus(b.toString());
};

export const mul = (a: argumentType, b: argumentType) => {
  return new BigNumber(a.toString()).multipliedBy(b.toString());
};

export const div = (a: argumentType, b: argumentType) => {
  return new BigNumber(a.toString()).div(b.toString());
};

export const isGreaterThan = (a: argumentType, b: argumentType) => {
  return new BigNumber(a.toString()).isGreaterThan(b.toString());
};

export const isGreaterThanOrEqual = (a: argumentType, b: argumentType) => {
  return new BigNumber(a.toString()).isGreaterThanOrEqualTo(b.toString());
};
