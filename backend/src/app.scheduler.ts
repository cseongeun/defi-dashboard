import schedule from 'node-schedule';
import SchedulerInstances from './scheduler';
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

  async updateScheduler(id: number, error: boolean, error_msg: string, status: string) {
    return SchedulerService.update({ id }, { error, error_msg, status });
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
    try {
      const status = await this.checkStatus(id);
      console.log(status);
      if (status) {
        const targetSchedulerInstance = this.schedulerInstanceById.get(id);
        await targetSchedulerInstance.run();
        await this.updateScheduler(id, false, null, STATUS.ACTIVATE);
      }
    } catch (e) {
      console.log(e);
      await this.updateScheduler(id, true, JSON.stringify(e.message), STATUS.DEACTIVATE);
    }
  }

  async run() {
    return Promise.all(
      this.schedulers.map(async (scheduler) => {
        await this.initInstance(scheduler.id);
        await this.updateScheduler(scheduler.id, false, null, STATUS.ACTIVATE);
        console.log(`${scheduler.name} scheduler start`);
        schedule.scheduleJob(scheduler.cron, () => {
          this.execute(scheduler.id);
        });
      }),
    );
  }
}

(async () => {
  const schedulers = await SchedulerService.findAll();
  const appScheduler = new AppScheduler(schedulers);
  await appScheduler.run();
})();
