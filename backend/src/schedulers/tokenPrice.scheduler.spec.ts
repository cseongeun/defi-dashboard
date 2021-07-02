import { default as TokenPriceScheduler } from './tokenPrice.scheduler';
import MultiToken, { MultiTokenAssociations } from '../models/MultiToken';

describe('TokenPriceScheduler', () => {
  it('asdf', async () => {});
  it('getMultiTokens', async () => {
    const multiTokens = await TokenPriceScheduler.getMultiTokens();
    console.log(multiTokens);
  });
});
