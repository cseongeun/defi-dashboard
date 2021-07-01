import { TokenPriceScheduler } from '../schedulers';

class SchedulerService {
  schedulers = new Map<string, any>();

  constructor() {
    this.schedulers.set(TokenPriceScheduler.property.name, TokenPriceScheduler); // TokenPriceScheduler
  }

  init() {
    this.schedulers.forEach((instance, name) => {
      instance.init();
    });
  }
}
