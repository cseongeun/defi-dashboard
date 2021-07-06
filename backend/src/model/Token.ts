import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network, { NetworkAttributes } from './Network';
import { IStatus, STATUS } from './common/interface';

interface ITokenType {
  SINGLE: string;
  MULTI: string;
}

const TokenType = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
};

interface TokenAttributes {
  id: number;
  network_id: number;
  type: ITokenType;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  pair0_token_id: number;
  pair1_token_id: number;
  price_address: string;
  price_decimals: number;
  price_usd: string;
  icon_link: string;
  status: IStatus;
}

interface TokenExtendsAttributes extends TokenAttributes {
  pair0?: null | TokenAttributes;
  pair1?: null | TokenAttributes;
  Network?: NetworkAttributes;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {}

interface TokenInstance extends Model<TokenAttributes, TokenCreationAttributes>, TokenAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Token = sequelize.define<TokenInstance>(
  'Token',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    network_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.keys(TokenType),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pair0_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    pair1_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    price_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    price_decimals: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_usd: {
      type: DataTypes.DECIMAL(12, 8),
      allowNull: true,
    },
    icon_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUS),
      allowNull: false,
      defaultValue: STATUS.ACTIVATE,
    },
  },
  {
    tableName: 'token',
    indexes: [{ fields: ['network_id', 'address'], unique: true }],
  },
);

Token.belongsTo(Network, { foreignKey: 'network_id', targetKey: 'id' });
Token.belongsTo(Token, { foreignKey: { name: 'pair0_token_id', allowNull: true }, targetKey: 'id', as: 'pair0' });
Token.belongsTo(Token, { foreignKey: { name: 'pair1_token_id', allowNull: true }, targetKey: 'id', as: 'pair1' });

const TokenAssociations = Object.keys(Token.associations);

export { TokenType, ITokenType, TokenAttributes, TokenExtendsAttributes, TokenAssociations };
export default Token;
