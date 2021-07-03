import { ethers } from 'ethers'
import Service from './service';

const NAME = 'AddressService'

class AddressService extends Service {
  name = NAME;

  init() {}


  toCheckSum(address: string) {
    return ethers.utils.getAddress(address);
  }

  isAddress(address: string) {
    try {
      this.toCheckSum(address);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default new AddressService();