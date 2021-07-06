import Contract, { ContractAssociations, ContractAttributes } from '../model/Contract';
import { isNull } from '../helper/type.helper';
import Service from './service';

class ContractService extends Service {
  name = 'ContractService';
  includeModels: string[] = ContractAssociations;

  async create(params: any, transaction: any = null) {
    return Contract.create(params, { transaction });
  }

  async findAll(
    condition?: any,
    options: { transaction?: any } = {
      transaction: null,
    },
  ) {
    const result = await Contract.findAll({
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
    const result = await Contract.findOne({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async isExist(condition: any) {
    return !!isNull(Contract.findOne({ where: { ...condition } }));
  }
}

export { ContractAttributes };
export default new ContractService();
