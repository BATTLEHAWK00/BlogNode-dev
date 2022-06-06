import KoaLogger from 'koa-logger';

import logging from '../logging';
import { KoaMiddleware, ServerMiddleware } from '../middleware';

class LoggingMiddleware extends ServerMiddleware {
  protected setName(): string {
    return 'Logging';
  }

  getKoaMiddleware(): KoaMiddleware | Promise<KoaMiddleware> {
    return KoaLogger((str) => logging.systemLogger.debug(str));
  }
}

export default new LoggingMiddleware();
