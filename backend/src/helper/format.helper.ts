import { BigNumber, ethers } from 'ethers';

class FormatHelper {
  toCommify(amount: number | string | BigNumber): string {
    return ethers.utils.commify(amount.toString());
  }

  toCheckSumAddress(address: string): string {
    return ethers.utils.getAddress(address);
  }
}

export default new FormatHelper();
