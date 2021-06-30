import Service from './abstract.service';
import Abi from '../models/Abi';

class AbiService extends Service {
  async create(params: any, transaction: any = null) {
    return Abi.create(params, { transaction });
  }

  async findAll(condition: any, transaction: any = null) {
    return Abi.findAll({ where: { ...condition }, transaction });
  }

  async findOne(condition: any, transaction: any = null) {
    return Abi.findOne({ where: { ...condition }, transaction });
  }
}

export default new AbiService();
