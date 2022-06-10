import cac from 'cac';

import { DatabaseConfig, HttpConfig, SystemConfig } from '../interface/config';

const cli = cac();
const cliArgs = cli.parse();

const systemConfig:SystemConfig = {
  blogName: 'Blog-Node',
  logLevel: cliArgs.options.loglevel,
};

const httpConfig: HttpConfig = {
  address: process.env.HOST || '0.0.0.0',
  port: Number.parseInt(process.env.PORT || '8080', 10),
};

const dbConfig: DatabaseConfig = {
  host: 'localhost',
  port: 27017,
  dbName: 'test',
};

const isDev = process.env.NODE_ENV === 'development';

export default {
  systemConfig,
  httpConfig,
  dbConfig,
  isDev,
};
