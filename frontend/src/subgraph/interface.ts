import { BigNumber } from '@ethersproject/bignumber';

export interface IUniswapFactory {
  id: String; // factory address
  pairCount: number; // amount of pairs created by the Uniswap factory
  totalVolumeUSD: BigNumber; // all time USD volume across all pairs (USD is derived)
  totalVolumeETH: BigNumber; // all time volume in ETH across all pairs (ETH is derived)
  totalLiquidityUSD: BigNumber; // total liquidity across all pairs stored as a derived USD amount
  totalLiquidityETH: BigNumber; // total liquidity across all pairs stored as a derived ETH amount
  txCount: BigInt; // all time amount of transactions across all pairs
}

export interface IToken {
  id: string; // token address
  symbol: String; // token symbol
  name: String; // token name
  decimals: BigInt; // token decimals
  tradeVolume: BigNumber; // amount of token traded all time across all pairs
  tradeVolumeUSD: BigNumber; // amount of token in USD traded all time across pairs (only for tokens with liquidity above minimum threshold)
  untrackedVolumeUSD: BigNumber; // amount of token in USD traded all time across pairs (no minimum liquidity threshold)
  txCount: BigInt; // amount of transactions all time in pairs including token
  totalLiquidity: BigNumber; // total amount of token provided as liquidity across all pairs
  derivedETH: BigNumber; // ETH per token
}
export interface IPair {
  id: string; // pair contract address
  factory: IUniswapFactory; // reference to Uniswap factory entity
  token0: IToken; // reference to token0 as stored in pair contract
  token1: IToken; // reference to token1 as stored in pair contract
  reserve0: BigNumber; // reserve of token0
  reserve1: BigNumber; // reserve of token1
  totalSupply: BigNumber; // total supply of liquidity token distributed to LPs
  reserveETH: BigNumber; // total liquidity in pair stored as an amount of ETH
  reserveUSD: BigNumber; // total liquidity amount in pair stored as an amount of USD
  trackedReserveETH: BigNumber; // total liquidity with only tracked amount (see tracked amounts)
  token0Price: BigNumber; // token0 per token1
  token1Price: BigNumber; // token1 per token0
  volumeToken0: BigNumber; // amount of token0 swapped on this pair
  volumeToken1: BigNumber; // amount of token1 swapped on this pair
  volumeUSD: BigNumber; // total amount swapped all time in this pair stored in USD (only tracked if USD liquidity is above minimum threshold)
  untrackedVolumeUSD: BigNumber; // total amount swapped all time in this pair stored in USD, no minimum liquidity threshold
  txCount: BigInt; // all time amount of transactions on this pair
  createdAtTimestamp: BigInt; // timestamp contract was created
  createdAtBlockNumber: BigInt; // Ethereum block contract was created
  liquidityPositions: ILiquidityPosition[]; // array of liquidity providers, used as a reference to LP entities
}

export interface IUser {
  id: string; // user address
  liquidityPositions: ILiquidityPosition[]; // array of all liquidity positions user has open
  usdSwapped: BigNumber; // total USD value swapped
}

export interface ILiquidityPosition {
  id: string; // user address and pair address concatenated with a dash
  user: IUser; // reference to user
  pair: IPair; // reference to the pair liquidity is being provided on
  liquidityTokenBalance: BigNumber; // amount of LP tokens minted for this position
}

export interface IBundle {
  id: number; // constant 1
  ethPrice: BigNumber; //	derived price of ETH in USD based on stablecoin pairs
}

export interface IMint {
  id: string; // Transaction hash plus index in the transaction mint array
  transaction: ITransaction; // reference to the transaction Mint was included in
  timestamp: BigInt; // timestamp of Mint, used to sort recent liquidity provisions
  pair: IPair; // reference to pair
  to: string; // recipient of liquidity tokens
  liquidity: BigNumber; // amount of liquidity tokens minted
  sender: string; // address that initiated the liquidity provision
  amount0: BigNumber; // amount of token0 provided
  amount1: BigNumber; // amount of token1 provided
  logIndex: BigInt; // index in the transaction event was emitted
  amountUSD: BigNumber; // derived USD value of token0 amount plus token1 amount
  feeTo: string; // address of fee recipient (if fee is on)
  feeLiquidity: BigNumber; // amount of liquidity sent to fee recipient (if fee is on)
}
export interface IBurn {
  id: string; //	Transaction hash plus index in the transaction burn array
  transaction: ITransaction; //	reference to the transaction Burn was included in
  timestamp: BigInt; //	timestamp of Burn, used to sort recent liquidity removals
  pair: IPair; //	reference to pair
  to: string; //	recipient of tokens
  liquidity: BigNumber; //	amount of liquidity tokens burned
  sender: string; //	address that initiated the liquidity removal
  amount0: BigNumber; //	amount of token0 removed
  amount1: BigNumber; //	amount of token1 removed
  logIndex: BigInt; //	index in the transaction event was emitted
  amountUSD: BigNumber; //	derived USD value of token0 amount plus token1 amount
  feeTo: string; //	address of fee recipient (if fee is on)
}
export interface ISwap {
  id: string; //	transaction hash plus index in Transaction swap array
  transaction: ITransaction; //	reference to transaction swap was included in
  timestamp: BigInt; //	timestamp of swap, used for sorted lookups
  pair: IPair; //	reference to pair
  sender: string; //	address that initiated the swap
  amount0In: BigNumber; //	amount of token0 sold
  amount1In: BigNumber; //	amount of token1 sold
  amount0Out: BigNumber; //	amount of token0 received
  amount1Out: BigNumber; //	amount of token1 received
  to: string; //	recipient of output tokens
  logIndex: BigInt; //	event index within transaction
  amountUSD: BigNumber; //	derived amount of tokens sold in USD
}

export interface ITransaction {
  id: string; // Ethereum transaction hash
  blockNumber: BigInt; // block transaction was mined in
  timestamp: BigInt; // timestamp for transaction
  mints: IMint[]; // array of Mint events within the transaction, 0 or greater
  burns: IBurn[]; // array of Burn events within transaction, 0 or greater
  swaps: ISwap[]; // array of Swap events within transaction, 0 or greater
}
