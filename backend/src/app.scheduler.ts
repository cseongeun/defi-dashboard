import schedule from 'node-schedule';
import { isNull } from './helper/type.helper';
import { SchedulerInstances } from './scheduler';
import { SchedulerService, SchedulerAttributes, STATUS } from './service';

class AppScheduler {
  schedulers: SchedulerAttributes[];
  schedulerInstanceById = new Map<number, any>();

  constructor(schedulers: SchedulerAttributes[]) {
    this.schedulers = schedulers;
    this.schedulers.forEach((scheduler) => {
      const instance = SchedulerInstances.find((instance) => instance.name === scheduler.name);
      if (isNull(instance)) {
        console.log(`Not found scheduler instance ${scheduler.name}`);
        // this.updateScheduler(this.schedulers.id, true, 'Not matched any instance name', STATUS.DEACTIVATE)
        // this.schedulers.pop;
      }

      if (isNull(instance)) {
      } else {
        this.schedulerInstanceById.set(scheduler.id, instance);
      }
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
      if (status) {
        const targetSchedulerInstance = this.schedulerInstanceById.get(id);
        if (!targetSchedulerInstance.working) {
          await targetSchedulerInstance.run();
          await this.updateScheduler(id, false, null, STATUS.ACTIVATE);
        }
      }
    } catch (e) {
      await this.updateScheduler(id, true, JSON.stringify(e), STATUS.DEACTIVATE);
      throw new Error(e);
    }
  }

  async run() {
    return Promise.all(
      this.schedulers.map(async (scheduler) => {
        await this.initInstance(scheduler.id);
        await this.updateScheduler(scheduler.id, false, null, STATUS.ACTIVATE);
        console.log(`${scheduler.name} scheduler start`);
        schedule.scheduleJob(scheduler.cron, async () => {
          await this.execute(scheduler.id);
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
