import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network from './Network';

interface IStatus {
  ACTIVATE: string;
  DEACTIVATE: string;
}

const STATUS: IStatus = {
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
};

interface ProtocolAttributes {
  id: number;
  network_id: number;
  name: string;
  symbol?: string;
  status: IStatus;
}

interface ProtocolCreationAttributes extends Optional<ProtocolAttributes, 'id'> {}

interface ProtocolInstance extends Model<ProtocolAttributes, ProtocolCreationAttributes>, ProtocolAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Protocol = sequelize.define<ProtocolInstance>(
  'Protocol',
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
    tableName: 'protocol',
    indexes: [{ fields: ['network_id', 'name'], unique: true }],
  },
);

Protocol.belongsTo(Network, { foreignKey: 'network_id', targetKey: 'id' });

export default Protocol;
