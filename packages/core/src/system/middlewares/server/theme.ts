import system from '@src/orm/service/system';
import { ServerMiddleware } from '@src/system/middleware';
import theme from '@src/system/theme';

class ThemeMiddleware extends ServerMiddleware {
  async getKoaMiddleware(): Promise<null> {
    await theme.register(await system.get('themePackage'));
    return null;
  }
}

export default new ThemeMiddleware();
