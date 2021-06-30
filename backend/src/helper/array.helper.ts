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
