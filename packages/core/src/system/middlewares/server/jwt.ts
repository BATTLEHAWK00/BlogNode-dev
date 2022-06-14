import { systemService } from '@src/orm/service/system';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';
import jwt = require('koa-jwt');

// todo 完善jwt功能封装
class JwtMiddleware extends ServerMiddleware {
  async getKoaMiddleware(): Promise<KoaMiddleware | null> {
    return jwt({ secret: await systemService.get('jwt-secret') as string });
  }
}
export default new JwtMiddleware();
