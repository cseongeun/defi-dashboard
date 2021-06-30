import { ethers } from 'ethers';
import PancakeBunny from './index';
import { AbiService } from '../../service';

describe('PancakeBunny', () => {
  const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
  const pancakeBunny = new PancakeBunny(provider);
  test('Is defined', async () => {
    const address = '0xb3C96d3C3d643c2318E4CDD0a9A48aF53131F5f4';

    const res = await AbiService.findOne({ address });
    console.log(res);
  });
  it('dashboard ', async () => {
    const res = await pancakeBunny.dashboard.BUNNY();
    console.log(res);
  });
});
