import schedule from 'node-schedule';
import SchedulerInstances from './schedulers';
import { SchedulerService, SchedulerAttributes, STATUS } from './service';

class AppScheduler {
  schedulers: SchedulerAttributes[];
  schedulerInstanceById = new Map<number, any>();

  constructor(schedulers: SchedulerAttributes[]) {
    this.schedulers = schedulers;
    this.schedulers.forEach((scheduler) => {
      const instance = SchedulerInstances.find((instance) => instance.name === scheduler.name);
      this.schedulerInstanceById.set(scheduler.id, instance);
    });
  }

  async checkStatus(id: number) {
    const scheduler = await SchedulerService.findOne({ id });
    return scheduler.status === STATUS.ACTIVATE;
  }

  async initInstance(id: number) {
    const targetSchedulerInstance = this.schedulerInstanceById.get(id);
    await targetSchedulerInstance.init();
  }

  async execute(id: number) {
    const status = await this.checkStatus(id);
    if (!status) return;

    const targetSchedulerInstance = this.schedulerInstanceById.get(id);
    await targetSchedulerInstance.run();
  }

  async run() {
    return Promise.all(
      this.schedulers.map(async (scheduler) => {
        await this.initInstance(scheduler.id);
        schedule.scheduleJob(scheduler.cron, () => {
          this.execute(scheduler.id);
        });
      }),
    );
  }
}

(async () => {
  const schedulers = await SchedulerService.findAll();
  const appScheduler = new AppScheduler(schedulers)
  await appScheduler.run();
})();
