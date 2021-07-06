import PancakeSwap from './pancakeSwap';

describe('PancakeSwap', () => {
  beforeAll(async () => {
    await PancakeSwap.init();
  });

  it('getPoolLength', async () => {
    const length = await PancakeSwap.getPoolLength();
    console.log(length.toString());
  });

  it('getPoolInfo', async () => {
    const info = await PancakeSwap.getPoolInfo(1);
    console.log(info);
  });
});
