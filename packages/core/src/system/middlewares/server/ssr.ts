import * as path from 'path';
import bus from '@src/system/bus';
import config from '@src/system/config';
import { BlogNodeFatalError, BlogNodeInternalServerError } from '@src/system/error';
import logging from '@src/system/logging';
import { ServerMiddleware } from '@src/system/middleware';
import moduleLoader from '@src/system/moduleLoader';
import routerRegistry from '@src/system/routerRegistry';
import theme, { ThemeProcessor } from '@src/system/theme';
import template from '@src/util/template';
import { Awaitable } from '@src/util/types';
import { Timer } from '@src/util/utils';
import { Context, Next } from 'koa';

const logger = logging.getLogger('PageRenderer');

export interface SsrConfig{
  themeDir: string
  isDev: boolean
}

export interface SsrMiddlewareInfo {
  name: string
  configure: (ctx: SsrConfig)=> Awaitable<void>
  prepare: ()=> Awaitable<void>
  render: (koaCtx: Context, pageCtx: unknown, pageName: string)=> Promise<string | null>
  close: ()=> Awaitable<void>
}

export type SsrMiddlewareModule = {
  default: SsrMiddlewareInfo
};

const render = (middleware: SsrMiddlewareInfo) => async (ctx: Context, next: Next) => {
  const handlerTimer = new Timer();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTime = await handlerTimer.decorate(() => next());
  if (ctx._pageName) {
    const timer = new Timer();
    timer.start();
    const pageCtx = {
      pageCtx: ctx._pageCtx,
      blogNodeCtx: ctx._blogNodeCtx || {},
    };
    try {
      const pageBody = await middleware.render(ctx, pageCtx, ctx._pageName);
      const html = template.renderHtml({
        pageHead: ctx._pageHead || '',
        pageBody: pageBody || '',
        pageTitle: ctx._pageTitle,
        pageLang: 'en',
        scriptTags: ctx._pageScripts || [],
        linkTags: ctx._pageLinks || [],
        pageCtx,
        pageName: path.basename(ctx._pageName),
      });
      timer.end();
      if (html) {
        ctx.body = html;
        logger.debug(`Rendered page: ${ctx._pageName} (${timer.result()}ms)`);
      }
    } catch (e) {
      throw new BlogNodeInternalServerError(`Error occurred when rendering page: ${ctx._pageName}`, { cause: e instanceof Error ? e : undefined });
    }
  }
};

class SsrMiddleware extends ServerMiddleware {
  private timer = new Timer();

  private theme?: ThemeProcessor;

  private middleware?: SsrMiddlewareInfo;

  beforeSetting(): void {
    logging.systemLogger.debug('Initializing SSR engine...');
    this.timer.start();
    setTimeout(() => {
      if (!this.timer.isStopped()) throw new BlogNodeFatalError('SSR Engine start timed out!');
    }, 20000);
    this.theme = theme.getCurrentTheme();
  }

  afterSetting(): void {
    bus.once('system/beforeStop', async () => {
      logging.systemLogger.debug('Closing SSR engine...');
      await this.middleware?.close();
    });
    this.timer.end();
    logging.systemLogger.debug(`SSR engine initialization complete.(${this.timer.result()}ms)`);
  }

  async getKoaMiddleware(): Promise<null> {
    const ssrMiddlewarePkg = this.theme?.getThemeInfo().ssrMiddleware;
    if (!ssrMiddlewarePkg) throw new BlogNodeFatalError('SSR initialization failed!');
    try {
      const middleware = (await moduleLoader.loadPackage<SsrMiddlewareModule>(ssrMiddlewarePkg)).default;
      await middleware.configure({
        isDev: config.isDev,
        themeDir: this.theme?.getThemeInfo().themePath as string,
      });
      const preparePromise = middleware.prepare();
      await bus.broadcast('routes/register');
      this.theme?.getThemeInfo().registerRoutes();
      this.getKoaRouter().use(render(middleware), routerRegistry.getRoutes());
      logging.systemLogger.debug(`Registered ${routerRegistry.getRouterSize()} routes.`);
      await preparePromise;
      return null;
    } catch (e) {
      throw new BlogNodeFatalError('SSR preparation failed!', e instanceof Error ? { cause: e } : undefined);
    }
  }
}

export default new SsrMiddleware();
