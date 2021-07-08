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

export const toSplitWithChunkSize = (array: any[], chunkSize: number) => {
  return _.chunk(array, chunkSize);
};

export const toSplitWithReturnSize = (array: any[], returnSize: number) => {
  let len = array.length;
  let chunkSize = len / returnSize;
  let temp = [];
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    temp.push(chunk);
  }
  return temp;
};
