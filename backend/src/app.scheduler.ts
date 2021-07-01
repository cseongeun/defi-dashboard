import schedule from 'node-schedule';
import SchedulerInstances from './schedulers';
import { SchedulerService, SchedulerExtendsAttributes } from './service';

class AppScheduler {
  schedulerMaps = new Map<number, SchedulerExtendsAttributes>()
  
  constructor(schedulers: any[]) {
    schedulers.forEach(scheduler => {
      const instance = SchedulerInstances.find(instance => instance.name === scheduler.name);
      this.schedulerMaps.set(scheduler.id, { ...scheduler, instance });
    })
  }

  run() {
    this.schedulerMaps.forEach((props, id) => {
      
    })

    const job = schedule.scheduleJob('42 * * * *', function(){
      console.log('The answer to life, the universe, and everything!');
    });
  }

  
	
}
