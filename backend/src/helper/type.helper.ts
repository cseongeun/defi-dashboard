import _ from 'lodash';

class TypeHelper {
  isNull(value: any) {
    return _.isNull(value);
  }
}

export default new TypeHelper();
