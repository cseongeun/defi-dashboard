import Network from '../models/Network';

enum STATUS {
  ACTIVATE,
  DEACTIVATE,
}

test('hello', async () => {
  const res = Object.values(STATUS);
  console.log(res);
});
