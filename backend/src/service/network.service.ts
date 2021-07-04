import Network, { NetworkAssociations, NetworkAttributes, NetworkExtendsAttributes } from '../models/Network';
import { STATUS } from '../models/common/interface';
import { TypeHelper } from '../helper';
import Service from './service';

const NAME = 'NetworkService';

class NetworkService extends Service {
  name = NAME;
  
  includeModels: any[];

  init() {
    this.includeModels = NetworkAssociations;
  }

  async create(params: any, transaction: any = null) {
    return Network.create(params, { transaction });
  }

  async findAll(
    condition?: any,
    options: { extend?: boolean; status?: string; transaction?: any } = {
      extend: true,
      status: STATUS.ACTIVATE,
      transaction: null,
    },
  ) {
    return Network.findAll({
      where: { ...condition, status: options.status },
      include: options.extend ? this.includeModels : null,
      transaction: options.transaction,
      raw: true,
      nest: true,
    });
  }

  async findOne(
    condition?: any,
    options: { extend?: boolean; status?: string; transaction?: any } = {
      extend: true,
      status: STATUS.ACTIVATE,
      transaction: null,
    },
  ) {
    return Network.findOne({
      where: { ...condition, status: options.status },
      include: options.extend ? this.includeModels : null,
      transaction: options.transaction,
      raw: true,
      nest: true,
    });
  }

  async isExist(condition: any) {
    return !!TypeHelper.isNull(Network.findOne({ where: { ...condition } }));
  }
}

export { NetworkAttributes, NetworkExtendsAttributes };
export default new NetworkService();
