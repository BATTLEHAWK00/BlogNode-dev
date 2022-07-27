import config from '@src/system/config';
import Log4js from 'log4js';

const logLevel = config.systemConfig.logLevel || 'info';

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
systemLogger.log(logLevel, `Log level: ${logLevel}`);

function handleShutdown(): Promise<void> {
  systemLogger.debug('Shutting down loggers...');
  return new Promise<void>((resolve, reject) => Log4js.shutdown((err) => {
    if (err) reject(err);
    resolve();
  }));
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  getLogger,
  systemLogger,
  handleShutdown,
};
export default _default;
__blognode.logging = _default;
