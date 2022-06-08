import system from '@src/orm/service/system';
import { ServerMiddleware } from '@src/system/middleware';
import theme from '@src/system/theme';

class ThemeMiddleware extends ServerMiddleware {
  async getKoaMiddleware(): Promise<null> {
    theme.register(await system.get('themePath'));
    return null;
  }
}

export default new ThemeMiddleware();
