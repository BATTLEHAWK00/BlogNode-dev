import logging from '@src/system/logging';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';
import * as KoaLogger from 'koa-logger';
import { levels } from 'log4js';

const logger = logging.getLogger('HttpLog');

class LoggingMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware {
    return KoaLogger((_, args) => {
      const [, method, url, status, time] = args;
      if (!status) return;
      const output = `"${method} ${url}" ${status} ${time}`;
      let level = levels.TRACE;
      if (status >= 100 && status < 400) level = levels.DEBUG;
      if (status >= 400 && status < 500) level = levels.WARN;
      if (status >= 500 && status < 600) level = levels.ERROR;
      logger.log(level, output);
    });
  }
}

export default new LoggingMiddleware();
