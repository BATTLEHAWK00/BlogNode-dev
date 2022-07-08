import { ServerMiddleware } from '@src/system/middleware';

// todo 完善jwt功能封装
class JwtMiddleware extends ServerMiddleware {
  async getKoaMiddleware(): Promise<null> {
    return null;
  }
}
export default new JwtMiddleware();
