import UniswapV2Subgraph from './index';

describe('UniswapV2Subgraph', () => {
  it('getLiquidityPositions', async () => {
    const res = await UniswapV2Subgraph.getLiquidityPositions('0x6d9893fa101cd2b1f8d1a12de3189ff7b80fdc10');
    console.log(res);
  });
  it('getPair', async () => {
    const res = await UniswapV2Subgraph.getPair('0x94b0a3d511b6ecdb17ebf877278ab030acb0a878');
    console.log(res);
  });
});
