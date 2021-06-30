import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';

interface AbiAttributes {
  id: number;
  address: string;
  data: string;
}

interface AbiCreationAttributes extends Optional<AbiAttributes, 'id'> {}

interface AbiInstance extends Model<AbiAttributes, AbiCreationAttributes>, AbiAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Abi = sequelize.define<AbiInstance>(
  'Abi',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: 'abi',
    indexes: [{ fields: ['address'], unique: true }],
  },
);

export default Abi;
