import { Provider } from '@ethersproject/providers';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import { IStatus, STATUS } from './common/interface';

interface NetworkAttributes {
  id: number;
  name: string;
  sub_name: string;
  symbol: string;
  chain_id: number;
  rpc_url: string;
  block_time_sec?: number;
  explorer_url?: string;
  status: IStatus;
}

interface NetworkExtendsAttributes extends NetworkAttributes {
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
    sub_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    chain_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    block_time_sec: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    rpc_url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    explorer_url: {
      type: DataTypes.STRING(1000),
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
    tableName: 'network',
  },
);
const NetworkAssociations = Object.keys(Network.associations);

export { NetworkAssociations, NetworkAttributes, NetworkExtendsAttributes };
export default Network;
