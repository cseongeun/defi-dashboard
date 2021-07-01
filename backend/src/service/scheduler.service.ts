import { TokenPriceScheduler } from '../schedulers';
import { default as Scheduler } from '../models/Scheduler';
import { STATUS } from '../models/common/interface';

class SchedulerService {
  schedulers = new Map<string, any>();

  constructor() {
    this.schedulers.set(TokenPriceScheduler.property.name, TokenPriceScheduler); // TokenPriceScheduler
  }

  init() {
    this.schedulers.forEach((instance) => {
      instance.init();
    });
  }

  async update(condition: any, params: any, options: { transaction?: any } = { transaction: null }) {
    return Scheduler.update(
      { ...params },
      {
        where: {
          ...condition,
        },
        transaction: options.transaction,
      },
    );
  }

  async findAll(
    condition?: any,
    options: { status?: string } = {
      status: STATUS.ACTIVATE,
    },
  ) {
    return Scheduler.findAll({
      where: { ...condition, status: options.status },
      raw: true,
      nest: true,
    });
  }

  async findOne(
    condition?: any,
    options: { status?: string } = {
      status: STATUS.ACTIVATE,
    },
  ) {
    return Scheduler.findOne({
      where: { ...condition, status: options.status },
      raw: true,
      nest: true,
    });
  }

  updateSchedulerTime(id) {
    return this.update();
  }

  run() {}
}
