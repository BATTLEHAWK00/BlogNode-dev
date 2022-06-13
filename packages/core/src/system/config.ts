import type {
  DatabaseConfig, HttpConfig, LogLevel, SystemConfig,
} from '../interface/config';

const cliArgs = global.parsedArgs;
const { env } = process;

declare global{
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS{
    interface ProcessEnv{
      'server-address': string
      'server-port': string
      'db-port': number
      'db-host': string
      'db-name': string
    }
  }
}

const systemConfig: SystemConfig = {
  logLevel: cliArgs.options.loglevel as LogLevel,
};

const httpConfig: HttpConfig = {
  address: env['server-address'] || '0.0.0.0',
  port: Number.parseInt(env['server-port'] || '8080', 10),
};

const dbConfig: DatabaseConfig = {
  host: env['db-host'] || 'localhost',
  port: env['db-port'] || 27017,
  dbName: env['db-name'] || 'blognode',
};

const isDev = env.NODE_ENV === 'development';

export default {
  systemConfig,
  httpConfig,
  dbConfig,
  isDev,
};
