import { toCheckSumAddress } from '../../helper/address.helper';
import { add } from '../../helper/bignumber.helper';
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

  it('getPair', async () => {
    const address = toCheckSumAddress('0x0ed7e52944161450477ee417de9cd3a859b14fd0');
    console.log(address);
    const pair = await PancakeSwap.getPair('0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6');
    console.log(pair);
  });
});
