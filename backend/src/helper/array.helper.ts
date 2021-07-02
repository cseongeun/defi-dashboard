class ArrayHelper {
  convertArrayToObject(array: any[], key: string) {
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, []);
  }

  findGreaterThanZeroBalance(array: any[]) {
    return array.filter((v) => !v.balance.isZero());
  }
}

export default new ArrayHelper();
