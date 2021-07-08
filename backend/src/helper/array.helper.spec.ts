import { fillSequenceNumber, toSplitWithReturnSize } from './array.helper';

describe('ArrayHelper', () => {
  describe('toSplitWithReturnSize', () => {
    it('test1', () => {
      const array = fillSequenceNumber(22);
      const result = toSplitWithReturnSize(array, 3);
      console.log(result);
    });
  });
});
