import { ApolloProvider } from '@apollo/client';
import { Routes } from './routes';

import { uniswapV2Client } from './subgraph/client';

const App: React.FC = () => {
  return (
    <ApolloProvider client={uniswapV2Client}>
      <Routes />
    </ApolloProvider>
  );
};

export default App;
