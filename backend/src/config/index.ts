import 'dotenv/config';

const config: { [key: string]: any } = {
  DB_HOST: process.env.DB_HOST,
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  OCTET_EXPLORER_API_TOKEN: process.env.OCTET_EXPLORER_API_TOKEN,
};

export default config;
