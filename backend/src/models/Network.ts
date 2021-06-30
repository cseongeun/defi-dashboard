import { Provider } from '@ethersproject/providers';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

export interface NetworkAttributes {
  id: number;
  name: string;
  subName: string;
  symbol: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
}

export interface NetworkExtendsAttributes extends NetworkAttributes {
  provider?: Provider;
}

interface NetworkCreationAttributes extends Optional<NetworkAttributes, 'id'> {}

interface NetworkInstance extends Model<NetworkAttributes, NetworkCreationAttributes>, NetworkAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Network = sequelize.define<NetworkInstance>(
  'Network',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    subName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    chainId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    rpcUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    explorerUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    tableName: 'network',
  },
);

export default Network;
