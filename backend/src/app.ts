import express from 'express';
import { Controllers } from './controller';

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

  initController() {
    Controllers.forEach((controller) => {
      try {
        console.log(`${controller.path} controller initialized`);
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

  app.initController();
  app.run();
})();
