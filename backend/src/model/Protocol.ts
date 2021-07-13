import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network from './Network';
import Token from './Token';
import { IStatus, STATUS } from './common/interface';

interface ProtocolAttributes {
  id: number;
  network_id: number;
  name: string;
  token_id: string;
  protocol_link: string;
  icon_link: string;
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
    token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    protocol_link: {
      type: DataTypes.STRING(500),
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
      defaultValue: STATUS.DEACTIVATE,
    },
  },
  {
    tableName: 'protocol',
    indexes: [{ fields: ['network_id', 'name'], unique: true }],
  },
);

Protocol.belongsTo(Network, { foreignKey: 'network_id', targetKey: 'id' });
Protocol.belongsTo(Token, { foreignKey: 'token_id', targetKey: 'id' });

const ProtocolAssociations = Object.keys(Protocol.associations);

export { ProtocolAssociations, ProtocolAttributes };
export default Protocol;
