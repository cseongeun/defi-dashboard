import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network, { NetworkAttributes } from './Network';
import { IStatus, STATUS } from './common/interface';

export interface ITokenType {
  SINGLE: string;
  MULTI: string;
}

export const TokenType: ITokenType = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
};

export interface TokenAttributes {
  id: number;
  network_id: number;
  type: ITokenType;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  price_address: string;
  price_decimals: number;
  price_usd: string;
  icon_link: string;
  status: IStatus;
}

export interface TokenExtendsAttributes extends TokenAttributes {
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
    price_address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    price_decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

export const TokenAssociations = Object.keys(Token.associations);

export default Token;
