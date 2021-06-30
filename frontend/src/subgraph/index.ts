import { uniswapV2Client, blockClient } from './client';
import {
  UniswapV2ETHPriceQuery,
  UniswapV2UserQuery,
  BlockNumberQuery,
  UniswapV2TokenPriceQuery,
  UniswapV2PairQuery,
} from './query';

export const getEtherPriceInUSD = async () => {
  const result = await uniswapV2Client.query({
    query: UniswapV2ETHPriceQuery,
  });

  return result?.data?.bundle?.ethPrice;
};

export const getUniswapV2LiquidityPositions = async ({ userAddress }: { userAddress: string }) => {
  const result = await uniswapV2Client.query({
    variables: {
      userAddress,
    },
    query: UniswapV2UserQuery,
  });

  return result?.data?.user?.liquidityPositions;
};

export const getUniswapV2TokenPrice = async ({ tokenAddress }: { tokenAddress: string }) => {
  const result = await uniswapV2Client.query({
    query: UniswapV2TokenPriceQuery,
    variables: {
      tokenAddress: tokenAddress.toLowerCase(),
    },
  });
  return result?.data?.token?.derivedETH;
};

// UniswapV2 Pair가 아닐 경우 null!
export const getUniswapV2Pair = async ({ pairAddress }: { pairAddress: string }) => {
  const result = await uniswapV2Client.query({
    query: UniswapV2PairQuery,
    variables: {
      pairAddress: pairAddress.toLowerCase(),
    },
  });
  return result?.data?.pair;
};

export const getLatestBlockNumber = async () => {
  const result = await blockClient.query({
    query: BlockNumberQuery,
  });
  return result?.data?.blocks?.[0]?.number;
};

(async () => {
  const token = '0xD85a6Ae55a7f33B0ee113C234d2EE308EdeAF7fD';
  const res1 = await getUniswapV2TokenPrice({ tokenAddress: token });
  console.log(res1);

  const pair = '0xD85a6Ae55a7f33B0ee113C234d2EE308EdeAF7fD';
  const res = await getUniswapV2Pair({ pairAddress: pair });
  console.log(res);

  // const perPair = new BigNumber(res?.trackedReserveETH).div(res?.totalSupply);
  // console.log(perPair.toString());
})();
/**
 FLETA 0x7788D759F21F53533051A9AE657fA05A1E068fc6
FLETA 0x7788D759F21F53533051A9AE657fA05A1E068fc6
BSC 0xe541504417670FB76b612B41B4392d967a1956c7
WETH 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
WETH-CBK UNI-V2 LP 0x60270a3b7C4bE0aFf35299Fe401C612CB7e1E173
CBK 0
 */
