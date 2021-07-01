import express from 'express';
import { uniswapRoute, pancakeBunnyRoute } from './routes';

class App {
  application: express.Application;

  constructor() {
    this.application = express();
    this.use();
  }

  use() {
    this.application.use('/uniswap', uniswapRoute);
  }
}

export default new App().application;
