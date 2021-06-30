import Service from './abstract.service';
import Protocol from '../models/Protocol';

class ProtocolService extends Service {
  async create(params: any, transaction: any = null) {
    return Protocol.create(params, { transaction });
  }

  async findAll(condition: any, transaction: any = null) {
    return Protocol.findAll({ where: { ...condition }, transaction });
  }

  async findOne(condition: any, transaction: any = null) {
    return Protocol.findOne({ where: { ...condition }, transaction });
  }
}

export default new ProtocolService();
