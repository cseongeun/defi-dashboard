import Scheduler, { SchedulerAttributes } from '../models/Scheduler';
import { STATUS } from '../models/common/interface';
import { TypeHelper } from '../helper';

class SchedulerService {
  async create(params: any, transaction: any = null) {
    return Scheduler.create(params, { transaction });
  }

  async findAll(
    condition?: any,
    options: { status?: string; transaction?: any } = {
      status: STATUS.ACTIVATE,
      transaction: null,
    },
  ) {
    return Scheduler.findAll({
      where: { ...condition, status: options.status },
      transaction: options.transaction,
      raw: true,
      nest: true,
    });
  }

  async findOne(
    condition?: any,
    options: { status?: string; transaction?: any } = {
      status: STATUS.ACTIVATE,
      transaction: null,
    },
  ) {
    return Scheduler.findOne({
      where: { ...condition, status: options.status },
      transaction: options.transaction,
      raw: true,
      nest: true,
    });
  }

  async isExist(condition: any) {
    return !!TypeHelper.isNull(Scheduler.findOne({ where: { ...condition } }));
  }
}

export { SchedulerAttributes };

export default new SchedulerService();
