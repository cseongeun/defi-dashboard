import Scheduler, { SchedulerAssociations, SchedulerAttributes, SchedulerExtendsAttributes } from '../model/Scheduler';
import { STATUS } from '../model/common/interface';
import { isNull } from '../helper/type.helper';
import Service from './service';

const NAME = 'SchedulerService';

class SchedulerService extends Service {
  name = 'SchedulerService';
  includeModels: string[] = SchedulerAssociations;

  async create(params: any, transaction: any = null) {
    return Scheduler.create(params, { transaction });
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
    options: { transaction?: any } = {
      transaction: null,
    },
  ) {
    const result = await Scheduler.findAll({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async findOne(
    condition?: any,
    options: { transaction?: any } = {
      transaction: null,
    },
  ) {
    const result = await Scheduler.findOne({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async isExist(condition: any) {
    return !!isNull(Scheduler.findOne({ where: { ...condition } }));
  }
}

export { SchedulerAttributes, SchedulerExtendsAttributes };
export default new SchedulerService();
