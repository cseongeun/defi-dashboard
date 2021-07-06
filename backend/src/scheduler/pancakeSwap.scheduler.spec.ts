import { fillSequenceNumber, toChunkSplit } from '../helper/array.helper';

describe('PancakeSwapScheduler', () => {
  beforeAll(async () => {});
  it('test', async () => {
    const pids = fillSequenceNumber(529);
    const [chunk1, chunk2, chunk3, chunk4, chunk5] = toChunkSplit(pids, pids.length / 5);

    console.log('chunk1', chunk1);
    console.log('chunk2', chunk2);
    console.log('chunk5', chunk5);
  });
});
