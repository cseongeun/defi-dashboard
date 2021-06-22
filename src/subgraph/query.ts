import { gql } from '@apollo/client';

export const UniswapV2ETHPriceQuery = gql`
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`;

export const UniswapV2UserQuery = gql`
  query userInfo($userAddress: String) {
    user(id: $userAddress) {
      liquidityPositions {
        pair {
          id
          token0 {
            id
            symbol
            name
            decimals
          }
          token1 {
            id
            symbol
            name
            decimals
          }
          reserve0
          reserve1
          totalSupply
          reserveETH
          reserveUSD
          token0Price
          token1Price
          volumeToken0
          volumeToken1
          volumeUSD
        }
        liquidityTokenBalance
      }
      usdSwapped
    }
  }
`;

export const getBlockNumberQuery = gql`
  query blockNumber {
    blocks(first: 1) {
      id
      number
      timestamp
    }
  }
`;
