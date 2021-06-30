import Service from './abstract.service';
import Token from '../models/Token';

class TokenService extends Service {
  async create(params: any, transaction: any = null) {
    return Token.create(params, { transaction });
  }

  async findAll(condition: any, transaction: any = null) {
    return Token.findAll({ where: { ...condition }, transaction });
  }

  async findOne(condition: any, transaction: any = null) {
    return Token.findOne({ where: { ...condition }, transaction });
  }
}

export default new TokenService();
