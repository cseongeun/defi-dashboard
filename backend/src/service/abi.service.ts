import Service from './service';
import Abi from '../models/Abi';

const NAME = 'AbiService';

class AbiService extends Service {
  name = NAME;

  init() {}

  async create(params: any, transaction: any = null) {
    return Abi.create(params, { transaction });
  }

  async update(condition: any, params: any, options: { transaction?: any } = { transaction: null }) {
    return Abi.update(
      { ...params },
      {
        where: {
          ...condition,
        },
        transaction: options.transaction,
      },
    );
  }

  async findAll(condition?: any) {
    return Abi.findAll({
      where: { ...condition },
      raw: true,
      nest: true,
    });
  }

  async findOne(condition: any) {
    return Abi.findOne({
      where: { ...condition },
      raw: true,
      nest: true,
    });
  }
}

export default new AbiService();
