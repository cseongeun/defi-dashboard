import { useState, useCallback } from 'react';
import { getLatestBlockNumber } from '../subgraph/index';
import { isNull } from '../utils/typeHelper';
import useInterval from './useInterval';

const useBlockNumber = () => {
  const [blockNumber, setBlockNumber] = useState(null);

  const fetchBlockNumber = useCallback(async () => {
    const blockNumberQuery = await getLatestBlockNumber();
    const { blocks } = blockNumberQuery.data;

    if (!isNull(blocks)) {
      setBlockNumber(blocks.number);
    }
  }, []);

  useInterval(() => {
    fetchBlockNumber();
  }, 10000);

  return blockNumber;
};

export default useBlockNumber;
