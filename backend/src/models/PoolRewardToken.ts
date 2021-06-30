import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';
import Pool from './Pool';
import Token from './Token';

interface IPoolRewardTokenAttributes {
  pool_id: number;
  token_id: number;
}

interface PoolRewardTokenInstance extends Model<IPoolRewardTokenAttributes>, IPoolRewardTokenAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const PoolRewardToken = sequelize.define<PoolRewardTokenInstance>(
  'PoolRewardToken',
  {
    pool_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'pool_reward_token',
    indexes: [{ fields: ['pool_id', 'token_id'], unique: true }],
  },
);

PoolRewardToken.belongsTo(Pool, { foreignKey: 'pool_id', targetKey: 'id' });
PoolRewardToken.belongsTo(Token, { foreignKey: 'token_id', targetKey: 'id' });

export default PoolRewardToken;
