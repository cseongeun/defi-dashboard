import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '.';
import { IStatus, STATUS } from './common/interface';

interface SchedulerAttributes {
  id: number;
  name: string;
  cron: string;
  error: boolean;
  error_msg: string;
  status: string;
}

interface SchedulerExtendsAttributes extends SchedulerAttributes {
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
    error_msg: {
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
    tableName: 'scheduler',
  },
);

const SchedulerAssociations = Object.keys(Scheduler.associations);

export { SchedulerAssociations, SchedulerAttributes, SchedulerExtendsAttributes };
export default Scheduler;
