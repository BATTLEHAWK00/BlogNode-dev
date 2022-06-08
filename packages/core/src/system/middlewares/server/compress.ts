import koaCompress from 'koa-compress';

import { KoaMiddleware, ServerMiddleware } from '../../middleware';

class CompressMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware | Promise<KoaMiddleware> {
    return koaCompress();
  }
}

export default new CompressMiddleware();
