import { ethers } from 'ethers';
import { toBigNumber } from './bignumber.helper';

export const zeroAddress = ethers.constants.AddressZero;
export const zeroHash = ethers.constants.HashZero;

export const zero = toBigNumber(0);
export const oneYearDays = toBigNumber(365);
export const oneDaySeconds = toBigNumber(86400);

export const standardERC20Address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // usdt
export const standardAggregatorV3Address = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'; // chainLink eth/usd - EACAggregatorProxy
export const pancakeBunnyMasterChefAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E';
