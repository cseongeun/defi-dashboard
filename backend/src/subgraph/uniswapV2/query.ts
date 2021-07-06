export const UniswapV2ETHPriceQuery = `
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`;

export const UniswapV2UserQuery = `
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

export const UniswapV2TokenPriceQuery = `
  query tokenPrice($tokenAddress: String) {
    token(id: $tokenAddress) {
      derivedETH
    }
  }
`;

export const UniswapV2PairQuery = `
  query pair($pairAddress: String) {
    pair(id: $pairAddress) {
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      totalSupply
      trackedReserveETH
    }
  }
`;
