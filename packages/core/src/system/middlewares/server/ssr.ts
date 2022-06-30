import bus from '@src/system/bus';
import config from '@src/system/config';
import { BlogNodeFatalError } from '@src/system/error';
import logging from '@src/system/logging';
import { KoaMiddleware, ServerMiddleware } from '@src/system/middleware';
import theme, { ThemeProcessor } from '@src/system/theme';
import { Awaitable } from '@src/util/types';
import { Timer } from '@src/util/utils';
import { Context, Next } from 'koa';
import NextApp, {
  NextApiHandler, NextApiRequest, NextApiResponse, NextConfig,
} from 'next';

const defaultNextConfig: NextConfig = {
  distDir: config.isDev ? '.next/development' : '.next',
  pageExtensions: ['tsx'],
  cleanDistDir: true,
};

interface INextApp{
  close: ()=> Promise<void>
  options: { quiet?: boolean }
  prepare: ()=> Promise<void>
  getRequestHandler: ()=> NextApiHandler
}

class SsrMiddleware extends ServerMiddleware {
  private timer = new Timer();

  private theme?: ThemeProcessor;

  private nextApp?: INextApp;

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
      await this.nextApp?.close();
    });

    this.timer.end();
    logging.systemLogger.debug(`SSR engine initialization complete.(${this.timer.result()}ms)`);
  }

  async getKoaMiddleware(): Promise<KoaMiddleware> {
    this.nextApp = NextApp({
      dev: config.isDev,
      dir: this.theme?.getThemeDir(),
      conf: { ...defaultNextConfig },
      minimalMode: true,
      quiet: true,
    });
    if (!this.nextApp) throw new BlogNodeFatalError('SSR initialization failed!');

    try {
      await this.nextApp.prepare();
    } catch (e) {
      throw new BlogNodeFatalError('SSR preparation failed!', e instanceof Error ? { cause: e } : undefined);
    }

    const nextHandler = this.nextApp.getRequestHandler();

    this.getKoaRouter().all('(.*)', async (ctx: Context) => {
      await nextHandler(<NextApiRequest>ctx.req, <NextApiResponse>ctx.res);
      ctx.respond = false;
    });
    return async (ctx: Context, next: Next) => {
      ctx.res.statusCode = 200;
      await next();
    };
  }
}

export default new SsrMiddleware();
