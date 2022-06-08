import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';
import theme from '@src/system/theme';
import fs from 'fs';
import koaStatic from 'koa-static';
import path from 'path';

class StaticMiddleware extends ServerMiddleware {
  getKoaMiddleware(): KoaMiddleware | null {
    const assetsDir = path.resolve(theme.getCurrentTheme().getThemeDir(), 'assets/');
    if (fs.existsSync(assetsDir)) {
      return koaStatic(assetsDir, {
        index: false,
        defer: true,
        hidden: false,
      });
    }
    return null;
  }
}

export default new StaticMiddleware();
