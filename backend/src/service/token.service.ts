import Service from './service';
import Token, { TokenType, TokenAssociations, TokenExtendsAttributes } from '../model/Token';
import { isNull } from '../helper/type.helper';

class TokenService extends Service {
  name = 'TokenService';
  includeModels: string[] = TokenAssociations;

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
    options: { transaction?: any } = {
      transaction: null,
    },
  ) {
    const result = await Token.findAll({
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
    const result = await Token.findOne({
      where: { ...condition },
      include: this.includeModels,
      transaction: options.transaction,
    });
    return JSON.parse(JSON.stringify(result));
  }

  async isExist(condition?: any) {
    return !!isNull(Token.findOne({ where: { ...condition } }));
  }
}

export { TokenType, TokenAssociations, TokenExtendsAttributes };

export default new TokenService();
