export const PancakeSwapV2PairQuery = `
  query pair($pairAddress: String) {
    pair(id: $pairAddress) {
      token0 {
        id
        name
        symbol
        decimals
      }
      token1 {
        id
        name
        symbol
        decimals
      }
    }
  }
`;
