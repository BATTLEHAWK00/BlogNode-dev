import config from '@src/system/config';
import Log4js from 'log4js';

const debugMode = process.env.DEBUG === 'true';

const logLevel = config.systemConfig.logLevel || debugMode ? 'debug' : 'info';

Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: {
    default: { appenders: ['console'], level: logLevel },
  },
});

function getLogger(name: string): Log4js.Logger {
  return Log4js.getLogger(name);
}

const systemLogger = getLogger('BlogNode');
systemLogger.info(`Log level: ${logLevel}`);

async function handleShutdown() {
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
