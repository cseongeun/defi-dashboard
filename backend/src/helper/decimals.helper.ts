import { shift } from './bignumber.helper';

export const multiplyDecimals = (value: string | number, decimals: number) => {
  return shift(value, decimals);
};

export const divideDecimals = (value: string | number, decimals: number) => {
  return shift(value, decimals * -1);
};
