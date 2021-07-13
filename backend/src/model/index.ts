import { Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USER_NAME, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 50,
    min: 50,
    acquire: 60000,
    idle: 60000,
  },
});

export { Sequelize, sequelize };
