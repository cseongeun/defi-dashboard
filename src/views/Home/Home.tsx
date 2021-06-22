import React from 'react';
import useBlockNumber from '../../hooks/useBlockNumber';
import useETHPriceInUSD from '../../hooks/useETHPriceInUSD';

const Home: React.FC = () => {
  const etherPrice = useETHPriceInUSD();
  const blockNumber = useBlockNumber();
  return (
    <>
      <div>{etherPrice}</div>
      <div>{blockNumber}</div>
    </>
  );
};

export default Home;
