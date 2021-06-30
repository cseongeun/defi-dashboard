import React from 'react';
import useETHPriceInUSD from '../../hooks/useETHPriceInUSD';

const Home: React.FC = () => {
  const etherPrice = useETHPriceInUSD();
  return (
    <>
      <div>{etherPrice}</div>
    </>
  );
};

export default Home;
