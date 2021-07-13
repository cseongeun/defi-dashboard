import express from 'express';
import { Controllers } from './controller';
import { DeFiInstances } from './defi';

class App {
  port: number;
  application: express.Application;

  constructor() {
    this.port = 3000;
    this.application = express();
  }

  run() {
    this.application
      .listen(this.port, () => console.log(`api server listening at ${this.port}`))
      .on('error', (err) => console.error(err));
  }

  async initDeFi() {
    DeFiInstances.forEach(async (defi) => {
      try {
        await defi.init();
        console.log(`${defi.name} instance initialize success`);
      } catch (e) {
        console.log(`${defi.name} instance initialize failed`);
        throw Error(e);
      }
    });
  }

  initController() {
    Controllers.forEach((controller) => {
      try {
        console.log(`${controller.path} controller initialize success`);
        this.application.use('/', controller.router);
      } catch (e) {
        console.log(`${controller.path} controller initialize failed`);
        throw Error(e);
      }
    });
  }
}

(async () => {
  const app = new App();

  app.initDeFi();
  app.initController();

  app.run();
})();
