import Token, { ITokenType, TokenType, TokenAssociations } from '../models/Token';
import { STATUS } from '../models/common/interface';
import { TypeHelper } from '../helper';

class TokenService {
  includeModels: any[];

  constructor() {
    this.includeModels = TokenAssociations;
  }

  async create(params: any, transaction: any = null) {
    return Token.create(params, { transaction });
  }

  async update(condition: any, params: any, options: { transaction?: any } = { transaction: null }) {
    return Token.update(
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
    return Token.findAll({
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
    return Token.findOne({
      where: { ...condition, status: options.status },
      include: options.extend ? this.includeModels : null,
      transaction: options.transaction,
      raw: true,
      nest: true,
    });
  }

  async isExist(condition?: any) {
    return !!TypeHelper.isNull(Token.findOne({ where: { ...condition } }));
  }
}

export { ITokenType, TokenType };

export default new TokenService();
