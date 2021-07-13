import { FormatHelper } from '../helper';

// 0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51;
// 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c;
// 0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82;

const address = '0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51';

const checkSumAddress = FormatHelper.toCheckSumAddress(address);

console.log(checkSumAddress);
