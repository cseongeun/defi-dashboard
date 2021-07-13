import Network, { NetworkAssociations, NetworkAttributes, NetworkExtendsAttributes } from '../model/Network';
import { STATUS } from '../model/common/interface';
import { isNull } from '../helper/type.helper';
import Service from './service';

class NetworkService extends Service {
  name = 'NetworkService';
  includeModels: string[] = NetworkAssociations;

  async create(params: any, transaction: any = null) {
    return Network.create(params, { transaction });
  }

  async findAll(
    condition?: any,
    options: { transaction?: any } = {
      transaction: null,
    },
  ) {
    const result = await Network.findAll({
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
    const result = await Network.findOne({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async isExist(condition: any) {
    return !!isNull(Network.findOne({ where: { ...condition } }));
  }
}

export { NetworkAttributes, NetworkExtendsAttributes };
export default new NetworkService();
