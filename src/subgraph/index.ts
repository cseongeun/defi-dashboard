import { uniswapV2Client, blockClient } from './client';
import { UniswapV2ETHPriceQuery, UniswapV2UserQuery, getBlockNumberQuery } from './query';

export const getEtherPriceInUSD = async () => {
  return uniswapV2Client.query({
    query: UniswapV2ETHPriceQuery,
  });
};

export const getUniswapV2User = async ({ userAddress }: { userAddress: string }) => {
  return uniswapV2Client.query({
    variables: {
      userAddress,
    },
    query: UniswapV2UserQuery,
  });
};

export const getLatestBlockNumber = async () => {
  return blockClient.query({
    query: getBlockNumberQuery,
  });
};
