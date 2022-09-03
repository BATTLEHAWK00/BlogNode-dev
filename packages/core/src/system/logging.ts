import config from '@src/system/config';
import Log4js from 'log4js';
import Cluster from 'cluster';

// const logLevel = config.systemConfig.logLevel || 'debug';
const logLevel = 'debug';

Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: {
    default: { appenders: ['console'], level: logLevel },
    // worker: { appenders: ['console'], level: 'off' },
  },
});

function getLogger(name: string): Log4js.Logger {
  const logger = Cluster.isWorker ? Log4js.getLogger(`worker.${name}`) : Log4js.getLogger(name);
  return logger;
}

const systemLogger = getLogger('BlogNode');
systemLogger.log(logLevel, `Log level: ${logLevel}`);

function handleShutdown(): Promise<void> {
  systemLogger.debug('Shutting down loggers...');
  return new Promise<void>((resolve, reject) => Log4js.shutdown((err) => {
    if (err) reject(err);
    resolve();
  }));
}

export default {
  getLogger,
  systemLogger,
  handleShutdown,
};
