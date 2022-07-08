import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';
import { Awaitable } from '@src/util/types';
import bodyParser = require('koa-bodyparser');

class BodyParserMiddleware extends ServerMiddleware {
  getKoaMiddleware(): Awaitable<KoaMiddleware | null> {
    return bodyParser({
    });
  }
}

export default new BodyParserMiddleware();
