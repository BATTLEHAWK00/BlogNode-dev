import Log4js from 'log4js';

const debugMode = process.env.DEBUG === 'true';

Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: {
    default: { appenders: ['console'], level: debugMode ? 'debug' : 'info' },
  },
});

function getLogger(name: string): Log4js.Logger {
  return Log4js.getLogger(name);
}

const systemLogger = getLogger('system');

export default {
  getLogger,
  systemLogger,
};
