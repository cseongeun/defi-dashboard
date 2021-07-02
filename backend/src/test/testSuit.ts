import { MultiTokenService, NetworkService, TokenService } from '../service';

class Test {
  networks: any;
  tokens: any;
  multiTokens: any;
  addresses: any;

  async init() {
    await Promise.all([NetworkService.init(), TokenService.init(), MultiTokenService.init()]);
    await Promise.all([this.initNetworks(), this.initTokens(), this.initMultiTokens(), this.initAddresses()]);
  }

  private async initNetworks() {
    this.networks = await NetworkService.findAll();
  }

  private async initTokens() {
    this.tokens = await TokenService.findAll();
  }

  private async initMultiTokens() {
    this.multiTokens = await MultiTokenService.findAll();
  }

  private async initAddresses() {
    this.addresses = [
      '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
      '0x73bceb1cd57c711feac4224d062b0f6ff338501e',
      '0x53d284357ec70ce289d6d64134dfac8e511c8a3d',
      '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
      '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      '0xf977814e90da44bfa03b6295a0616a897441acec',
      '0xdee6238780f98c0ca2c2c28453149bea49a3abc9',
      '0x229b5c097f9b35009ca1321ad2034d4b3d5070f6',
    ];
  }
}

export default new Test();
