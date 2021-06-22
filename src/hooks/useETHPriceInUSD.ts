import { useState, useCallback } from 'react';
import { getEtherPriceInUSD } from '../subgraph/index';
import { isNull } from '../utils/typeHelper';
import useInterval from './useInterval';

const useETHPriceInUSD = () => {
  const [ethPriceInUSD, setETHPriceInUSD] = useState(null);

  const fetchETHPriceInUSD = useCallback(async () => {
    const priceQuery = await getEtherPriceInUSD();
    const { bundle } = priceQuery.data;

    if (!isNull(bundle)) {
      setETHPriceInUSD(bundle.ethPrice);
    }
  }, []);

  useInterval(() => {
    fetchETHPriceInUSD();
  }, 10000);

  return ethPriceInUSD;
};

export default useETHPriceInUSD;
