import React from 'react';
import { DeFiContext } from './DeFi.Context';

const DeFiProvider: React.FC = ({ children }) => {
  const platforms = {};

  return <DeFiContext.Provider value={{ platforms }}>{children}</DeFiContext.Provider>;
};

export default DeFiProvider;
