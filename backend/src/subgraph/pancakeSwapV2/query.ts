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

export const PancakeSwapV2SmartChefFactoryQuery = `
  query smartChefFactory($smartChefAddress: String) {
    factory(id: $smartChefAddress) {
      totalSmartChef
    }
  }
`;

export const PancakeSwapV2SmartChefQuery = `
  query smartChefs($limit: Int!) {
    smartChefs(first: $limit) {
      id
      stakeToken {
        id
        name
        symbol
        decimals
      }
      earnToken {
        id
        name
        symbol
        decimals
      }
      reward
      startBlock
      endBlock
    }
  }
`;
