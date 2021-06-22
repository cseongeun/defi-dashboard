import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { Home } from './views';
import { uniswapV2Client } from './subgraph/client';

function App() {
  return (
    <ApolloProvider client={uniswapV2Client}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
