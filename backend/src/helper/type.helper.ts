import _ from 'lodash';

export const isNull = (value: any): boolean => {
  try {
    return _.isNull(value);
  } catch (e) {
    return false;
  }
};
