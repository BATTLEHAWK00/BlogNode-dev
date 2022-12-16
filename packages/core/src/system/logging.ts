import log4js from 'log4js';

log4js.configure({
  appenders: { console: { type: 'stdout' } },
  categories: { default: { appenders: ['console'], level: 'trace' } },
});

const systemLogger = log4js.getLogger('system');

class Logging {
  getLogger(category?: string) {
    if (!category) return systemLogger;
    return log4js.getLogger(category);
  }
}
export default new Logging();
