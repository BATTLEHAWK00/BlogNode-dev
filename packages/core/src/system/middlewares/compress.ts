import koaCompress from 'koa-compress';

import { KoaMiddleware, ServerMiddleware } from '../middleware';

class CompressMiddleware extends ServerMiddleware {
  protected setName(): string {
    return 'Compress';
  }

  getKoaMiddleware(): KoaMiddleware | Promise<KoaMiddleware> {
    return koaCompress();
  }
}

export default new CompressMiddleware();
