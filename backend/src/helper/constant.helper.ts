import { ethers } from 'ethers';

class ConstantHelper {
  zeroAddress() {
    return ethers.constants.AddressZero;
  }

  zeroHash() {
    return ethers.constants.HashZero;
  }

  aggregatorV3Address() {
    return '';
  }

  unit() {
    return {
      wei: 0,
      kwei: 3,
      mwei: 6,
      gwei: 9,
      szabo: 12,
      finney: 15,
      ether: 18,
    };
  }
}
