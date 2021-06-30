import { useState, useCallback } from 'react';
import { getEtherPriceInUSD } from '../subgraph/index';
import useInterval from './useInterval';

const useETHPriceInUSD = () => {
  const [ethPriceInUSD, setETHPriceInUSD] = useState(null);

  const fetchETHPriceInUSD = useCallback(async () => {
    const price = await getEtherPriceInUSD();
    setETHPriceInUSD(price);
  }, []);

  useInterval(() => {
    fetchETHPriceInUSD();
  }, 10000);

  return ethPriceInUSD;
};

export default useETHPriceInUSD;
