import { Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USER_NAME, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

export { Sequelize, sequelize };
