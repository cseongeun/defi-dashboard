import { ethers } from 'ethers';

class ConstantHelper {
  zeroAddress: string;
  zeroHash: string;
  standardERC20Address: string;
  standardAggregatorV3Address: string;

  constructor() {
    this.zeroAddress = ethers.constants.AddressZero;
    this.zeroHash = ethers.constants.HashZero;
    this.standardERC20Address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // usdt
    this.standardAggregatorV3Address = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'; // chainLink eth/usd - EACAggregatorProxy
  }
}

export default new ConstantHelper();
