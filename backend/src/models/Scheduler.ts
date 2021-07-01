import { Provider } from '@ethersproject/providers';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import { IStatus, STATUS } from './common/interface';

export interface SchedulerAttributes {
  id: number;
  name: string;
  subName: string;
  status: IStatus;
}

interface SchedulerCreationAttributes extends Optional<SchedulerAttributes, 'id'> {}

interface SchedulerInstance extends Model<SchedulerAttributes, SchedulerCreationAttributes>, SchedulerAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Scheduler = sequelize.define<SchedulerInstance>(
  'Scheduler',
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
    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUS),
      allowNull: false,
      defaultValue: STATUS.ACTIVATE,
    },
  },
  {
    tableName: 'Scheduler',
  },
);

export default Scheduler;
