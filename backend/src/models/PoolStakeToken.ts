import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';
import Pool from './Pool';
import Token from './Token';

interface IPoolStakeTokenAttributes {
  pool_id: number;
  token_id: number;
}

interface PoolStakeTokenInstance extends Model<IPoolStakeTokenAttributes>, IPoolStakeTokenAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const PoolStakeToken = sequelize.define<PoolStakeTokenInstance>(
  'PoolStakeToken',
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
    tableName: 'pool_stake_token',
    indexes: [{ fields: ['pool_id', 'token_id'], unique: true }],
  },
);

PoolStakeToken.belongsTo(Pool, { foreignKey: 'pool_id', targetKey: 'id' });
PoolStakeToken.belongsTo(Token, { foreignKey: 'token_id', targetKey: 'id' });

export default PoolStakeToken;
