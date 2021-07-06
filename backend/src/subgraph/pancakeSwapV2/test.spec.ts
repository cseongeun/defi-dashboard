import PancakeSwapV2Subgraph from './index';

describe('PancakeSwapV2Subgraph', () => {
  it('getPair', async () => {
    const res = await PancakeSwapV2Subgraph.getPair('0x0eD7e52944161450477ee417DE9Cd3a859b14fD0');
    console.log(res);
  });
});
