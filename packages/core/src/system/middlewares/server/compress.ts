import * as koaCompress from 'koa-compress';

import { KoaMiddleware, ServerMiddleware } from '../../middleware';

class CompressMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware {
    return koaCompress();
  }
}

export default new CompressMiddleware();
