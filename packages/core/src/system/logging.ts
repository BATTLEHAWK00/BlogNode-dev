import Log4js from 'log4js';

const debugMode = process.env.DEBUG === 'true';

const logLevel = debugMode ? 'debug' : 'info';

Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: {
    default: { appenders: ['console'], level: logLevel },
  },
});

function getLogger(name: string): Log4js.Logger {
  return Log4js.getLogger(name);
}

const systemLogger = getLogger('Blog-Node');
systemLogger.info(`Log level: ${logLevel}`);

export default {
  getLogger,
  systemLogger,
};
