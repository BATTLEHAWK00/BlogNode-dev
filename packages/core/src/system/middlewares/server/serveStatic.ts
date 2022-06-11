import logging from '@src/system/logging';
import { ServerMiddleware } from '@src/system/middleware';
import theme from '@src/system/theme';
import fs from 'fs';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import path from 'path';

class StaticMiddleware extends ServerMiddleware {
  private static prefix = '/assets';

  getKoaMiddleware(): null {
    const themeName = theme.getCurrentTheme().getThemeName();
    const themeDir = theme.getCurrentTheme().getThemeDir();
    const staticDir = theme.getCurrentTheme().getStaticDir();
    if (!staticDir) return null;
    const assetsDir = path.resolve(themeDir, staticDir);
    if (fs.existsSync(assetsDir)) {
      const serveStatic = koaStatic(assetsDir, {
        index: false,
        defer: false,
        hidden: false,
      });
      const staticRouter = new Router({ prefix: '/assets' });
      staticRouter.get('/(.*)', async (ctx, next) => {
        const rewritedPath = ctx.path.replace(StaticMiddleware.prefix, '');
        ctx.path = rewritedPath;
        await serveStatic(ctx, next);
      });
      this.getKoaRouter().use(staticRouter.routes());
    } else logging.systemLogger.debug(`Theme ${themeName} has non-existing static directory.`);
    return null;
  }
}

export default new StaticMiddleware();
