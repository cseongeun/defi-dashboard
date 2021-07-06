import TokenService from './token.service';

describe('TokenService', () => {
  beforeAll(async () => {
    await TokenService.init();
  });
  it('findAll', async () => {
    const tokens = await TokenService.findAll();
    console.log(tokens);
  });
});
