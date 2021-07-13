import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import Network from './Network';

interface ContractAttributes {
  id: number;
  network_id: number;
  name: string;
  address: string;
  data: string;
}

interface ContractExtendsAttributes extends ContractAttributes {}

interface ContractCreationAttributes extends Optional<ContractAttributes, 'id'> {}

interface ContractInstance extends Model<ContractAttributes, ContractCreationAttributes>, ContractAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Contract = sequelize.define<ContractInstance>(
  'Contract',
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
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'contract',
    indexes: [{ fields: ['network_id', 'address'], unique: true }],
  },
);

Contract.belongsTo(Network, { foreignKey: 'network_id', targetKey: 'id' });

const ContractAssociations = Object.keys(Contract.associations);

export { ContractAssociations, ContractAttributes, ContractExtendsAttributes };
export default Contract;
