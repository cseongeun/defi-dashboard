import Pool, { PoolAssociations, PoolAttributes } from '../model/Pool';
import { isNull } from '../helper/type.helper';
import Service from './service';

class PoolService extends Service {
  name = 'PoolService';
  includeModels: string[] = PoolAssociations;

  async create(params: any, transaction: any = null) {
    return Pool.create(params, { transaction });
  }

  async update(condition: any, params: any, options: { transaction?: any } = { transaction: null }) {
    return Pool.update(
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
    const result = await Pool.findAll({
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
    const result = await Pool.findOne({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async isExist(condition: any) {
    return !!isNull(Pool.findOne({ where: { ...condition } }));
  }
}

export { PoolAttributes };
export default new PoolService();
