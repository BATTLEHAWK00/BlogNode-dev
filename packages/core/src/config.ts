import { DatabaseConfig, HttpConfig, SystemConfig } from './interface/config';

const systemConfig:SystemConfig = {
  blogName: 'Hello',
};

const httpConfig: HttpConfig = {
  address: process.env.HOST || '0.0.0.0',
  port: Number.parseInt(process.env.PORT || '7000', 10),
};

const dbConfig: DatabaseConfig = {
  host: 'sv.battlehawk233.cn',
  port: 10036,
  userName: 'root',
  password: 'yxl123456.',
  dbName: 'examination_system',
};

const isDev = process.env.NODE_ENV === 'development';

export default {
  systemConfig,
  httpConfig,
  dbConfig,
  isDev,
};
