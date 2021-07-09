import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Protocol, { ProtocolAttributes } from './Protocol';
import Token, { TokenAttributes } from './Token';
import { IStatus, STATUS } from './common/interface';

interface PoolAttributes {
  id: number;
  protocol_id: number;
  type: string;
  pid: number;
  address: string;
  name: string;
  stake_token_id: number;
  reward_token_id: number;
  liquidity_amount: string;
  liquidity_usd: string;
  apy: string;
  apr: string;
  link: string;
  status: IStatus;
}

interface PoolExtendsAttributes extends PoolAttributes {
  protocol?: ProtocolAttributes;
  stakeToken?: TokenAttributes;
  rewardToken?: TokenAttributes;
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
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    liquidity_amount: {
      type: DataTypes.DECIMAL(33, 20),
      allowNull: true,
    },
    liquidity_usd: {
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
    indexes: [{ fields: ['protocol_id', 'pid', 'address'], unique: true }],
  },
);

Pool.belongsTo(Protocol, { foreignKey: 'protocol_id', targetKey: 'id' });
Pool.belongsTo(Token, { foreignKey: 'stake_token_id', targetKey: 'id', as: 'stakeToken' });
Pool.belongsTo(Token, { foreignKey: 'reward_token_id', targetKey: 'id', as: 'rewardToken' });

const PoolAssociations = Object.keys(Pool.associations);

export { PoolAssociations, PoolAttributes, PoolExtendsAttributes };
export default Pool;
