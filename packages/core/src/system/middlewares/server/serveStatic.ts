import logging from '@src/system/logging';
import { ServerMiddleware } from '@src/system/middleware';
import theme from '@src/system/theme';
import * as fs from 'fs';
import * as Router from 'koa-router';
import * as koaStatic from 'koa-static';
import * as path from 'path';

const logger = logging.getLogger('Static');

class StaticMiddleware extends ServerMiddleware {
  getKoaMiddleware(): null {
    const {
      themeName, themePath, staticDir, staticPrefix,
    } = theme.getCurrentTheme().getThemeInfo();
    if (!staticDir) return null;
    const assetsDir = path.resolve(themePath, staticDir);
    if (fs.existsSync(assetsDir)) {
      const serveStatic = koaStatic(assetsDir, {
        index: false,
        defer: false,
        hidden: false,
      });
      const prefix = staticPrefix || '/assets';
      logger.trace(`Static prefix: ${prefix}`);
      logger.trace(`Static dir: ${staticDir}`);
      const staticRouter = new Router({ prefix });
      staticRouter.get('/(.*)', async (ctx, next) => {
        const rewrittenPath = ctx.path.replace(prefix, '');
        ctx.path = rewrittenPath;
        logging.systemLogger.trace(`static hit: ${rewrittenPath}`);
        await serveStatic(ctx, next);
      });
      this.getKoaRouter().use(staticRouter.routes());
    } else logger.debug(`Theme ${themeName} has non-existing static directory.`);
    return null;
  }
}

export default new StaticMiddleware();
