import Protocol, { ProtocolAssociations, ProtocolAttributes } from '../model/Protocol';
import { STATUS } from '../model/common/interface';
import { isNull } from '../helper/type.helper';
import Service from './service';

class ProtocolService extends Service {
  name = 'ProtocolService';
  includeModels: string[] = ProtocolAssociations;

  async create(params: any, transaction: any = null) {
    return Protocol.create(params, { transaction });
  }

  async findAll(
    condition?: any,
    options: { transaction?: any } = {
      transaction: null,
    },
  ) {
    const result = await Protocol.findAll({
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
    const result = await Protocol.findOne({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async isExist(condition: any) {
    return !!isNull(Protocol.findOne({ where: { ...condition } }));
  }
}

export { ProtocolAttributes };
export default new ProtocolService();
