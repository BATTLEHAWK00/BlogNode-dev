import logging from '@src/system/logging';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';
import KoaLogger from 'koa-logger';

class LoggingMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware | Promise<KoaMiddleware> {
    return KoaLogger((str) => logging.systemLogger.debug(str));
  }
}

export default new LoggingMiddleware();
