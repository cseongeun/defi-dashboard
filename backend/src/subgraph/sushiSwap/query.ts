export const SushiSwapPairQuery = `
  query pair($pairAddress: String) {
    pair(id: $pairAddress) {
      token0 {
        id
				name
        symbol
				decimals
				derivedETH
      }
      token1 {
        id
				name
        symbol
				decimals
				derivedETH
      }
			reserveUSD
      totalSupply
      trackedReserveETH
    }
  }
`;
