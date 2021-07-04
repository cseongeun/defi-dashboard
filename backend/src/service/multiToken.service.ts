import MultiToken, { MultiTokenExtendsAttributes, MultiTokenAssociations } from '../models/MultiToken';
import { STATUS } from './common.service';
import { TypeHelper } from '../helper';
import Service from './service';

const NAME = 'MultiTokenService';

class MultiTokenService extends Service {
  name = NAME;
  
  includeModels: any[];

  init() {
    this.includeModels = MultiTokenAssociations;
  }

  async create(params: any, transaction: any = null) {
    return MultiToken.create(params, { transaction });
  }

  async update(condition: any, params: any, options: { transaction?: any } = { transaction: null }) {
    return MultiToken.update(
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
    options: { extend?: boolean; status?: string; transaction?: any } = {
      extend: true,
      status: STATUS.ACTIVATE,
      transaction: null,
    },
  ) {
    return MultiToken.findAll({
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
    return MultiToken.findOne({
      where: { ...condition, status: options.status },
      include: options.extend ? this.includeModels : null,
      transaction: options.transaction,
      raw: true,
      nest: true,
    });
  }

  async isExist(condition?: any) {
    return !!TypeHelper.isNull(MultiToken.findOne({ where: { ...condition } }));
  }
}

export { MultiTokenExtendsAttributes, MultiTokenAssociations };
export default new MultiTokenService();
