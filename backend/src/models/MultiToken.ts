import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network, { NetworkAttributes } from './Network';
import Token, { TokenAttributes } from './Token';
import { IStatus, STATUS } from './common/interface';

export interface MultiTokenAttributes {
  id: number;
  network_id: number;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  pair0_token_id: number;
  pair1_token_id: number;
  price_usd: string;
  icon_link: string;
  status: IStatus;
}

export interface MultiTokenExtendsAttributes extends MultiTokenAttributes {
  pair0?: TokenAttributes;
  pair1?: TokenAttributes;
  Network?: NetworkAttributes;
}

interface MultiTokenCreationAttributes extends Optional<MultiTokenAttributes, 'id'> {}

interface MultiTokenInstance extends Model<MultiTokenAttributes, MultiTokenCreationAttributes>, MultiTokenAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const MultiToken = sequelize.define<MultiTokenInstance>(
  'MultiToken',
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
    pair1_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    pair0_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'multi_token',
    indexes: [{ fields: ['network_id', 'address'], unique: true }],
  },
);

MultiToken.belongsTo(Network, { foreignKey: 'network_id', targetKey: 'id' });
MultiToken.belongsTo(Token, { foreignKey: 'pair0_token_id', targetKey: 'id', as: 'pair0' });
MultiToken.belongsTo(Token, { foreignKey: 'pair1_token_id', targetKey: 'id', as: 'pair1' });

export const MultiTokenAssociations = Object.keys(MultiToken.associations);

export default MultiToken;
