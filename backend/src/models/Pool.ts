import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Protocol from './Protocol';

interface IStatus {
  ACTIVATE: string;
  DEACTIVATE: string;
}

const STATUS: IStatus = {
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
};

interface PoolAttributes {
  id: number;
  protocol_id: number;
  name: string;
  is_proxy: boolean;
  address: string;
  proxy_address: string;
  liquidity: string;
  apy: string;
  apr: string;
  link: string;
  status: IStatus;
}

interface PoolCreationAttributes extends Optional<PoolAttributes, 'id'> {}

interface PoolInstance extends Model<PoolAttributes, PoolCreationAttributes>, PoolAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Pool = sequelize.define<PoolInstance>(
  'Pool',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    protocol_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    is_proxy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    proxy_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    liquidity: {
      type: DataTypes.DECIMAL(33, 20),
      allowNull: true,
    },
    apy: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    apr: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUS),
      allowNull: false,
      defaultValue: STATUS.DEACTIVATE,
    },
  },
  {
    tableName: 'pool',
    indexes: [{ fields: ['protocol_id', 'address'], unique: true }],
  },
);

Pool.belongsTo(Protocol, { foreignKey: 'protocol_id', targetKey: 'id' });

export default Pool;
