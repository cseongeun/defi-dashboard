import { createContext } from 'react';

export interface IDeFiContext {
  platforms: {};
}

export const DeFiContext = createContext<IDeFiContext>({
  platforms: {},
});
