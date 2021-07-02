import express from 'express';
import { Services } from './service';
import { Controllers } from './controllers';

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

  initService() {
    Services.forEach(async (service) => {
      try {
        console.log(`${service.name} instance initialized`);
        await service.init();
      } catch (e) {
        console.log(`${service.name} instance initialize failed`);
        throw Error(e);
      }
    });
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

  await app.initService();
  app.initController();
  app.run();
})();
