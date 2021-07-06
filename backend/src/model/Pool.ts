import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Protocol from './Protocol';
import Token from './Token';
import { IStatus, STATUS } from './common/interface';

interface PoolAttributes {
  id: number;
  protocol_id: number;
  pid: number;
  name: string;
  stake_token_id: number;
  reward_token_id: number;
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
    pid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    stake_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    reward_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
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
    indexes: [{ fields: ['protocol_id', 'pid'], unique: true }],
  },
);

Pool.belongsTo(Protocol, { foreignKey: 'protocol_id', targetKey: 'id' });
Pool.belongsTo(Token, { foreignKey: 'stake_token_id', targetKey: 'id' });
Pool.belongsTo(Token, { foreignKey: 'reward_token_id', targetKey: 'id' });

const PoolAssociations = Object.keys(Pool.associations);

export { PoolAssociations, PoolAttributes };
export default Pool;
