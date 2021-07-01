import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import { IStatus, STATUS } from './common/interface';

export interface SchedulerAttributes {
  id: number;
  name: string;
  cron: string;
  error: boolean;
  status: IStatus;
}

export interface SchedulerExtendsAttributes extends SchedulerAttributes {
  instance?: any;
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
    cron: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    error: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUS),
      allowNull: false,
      defaultValue: STATUS.ACTIVATE,
    },
  },
  {
    tableName: 'scheduler',
  },
);

export default Scheduler;
