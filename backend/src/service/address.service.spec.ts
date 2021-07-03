import AddressService  from "./address.service";


describe('AddressService', () => {
  beforeAll(async () => {
    await AddressService.init();
  })


  describe('isAddress', () => {
    it('check EOA Address', () => {

      const result = '0x8ba1f109551bd432803012645ac136ddd64dba72'
      console.log(result);
    })
  })
})