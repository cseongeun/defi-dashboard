import { assert } from 'chai';
import { default as TypeHelper } from './type.helper';

describe('TypeHelper', () => {
  describe('IsNull', () => {
    it('-', () => {
      assert.strictEqual(TypeHelper.isNull(null), true);
      assert.strictEqual(TypeHelper.isNull(false), false);
      assert.strictEqual(TypeHelper.isNull(true), false);
      assert.strictEqual(TypeHelper.isNull(undefined), false);
      assert.strictEqual(TypeHelper.isNull('1'), false);
      assert.strictEqual(TypeHelper.isNull(['1']), false);
      assert.strictEqual(TypeHelper.isNull(1), false);
      assert.strictEqual(TypeHelper.isNull('a'), false);
    });
  });
});
