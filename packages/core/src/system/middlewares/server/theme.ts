import { systemService } from '@src/orm/service/system';
import { ServerMiddleware } from '@src/system/middleware';
import theme from '@src/system/theme';

class ThemeMiddleware extends ServerMiddleware {
  async getKoaMiddleware(): Promise<null> {
    await theme.register(await systemService.get<string>('themePackage') || undefined);
    return null;
  }
}

export default new ThemeMiddleware();
