import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network, { NetworkAttributes } from './Network';

interface ITokenType {
  SINGLE: string;
  MULTI: string;
}

const TokenType = {
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
  icon_link: string;
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
    icon_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: 'token',
    indexes: [{ fields: ['network_id', 'address'], unique: true }],
  },
);

Token.belongsTo(Network, { foreignKey: 'network_id', targetKey: 'id' });

export default Token;
