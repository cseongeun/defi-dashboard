import _ from 'lodash';

export const convertArrayToObject = (array: any[], key: string) => {
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, []);
};

export const findGreaterThanZeroBalance = (array: any[]) => {
  return array.filter((v) => !v.balance.isZero());
};

export const fillSequenceNumber = (number: number) => {
  return Array.from(Array(number).keys());
};

export const toChunkSplit = (array: any[], size: number) => {
  return _.chunk(array, size);
};
