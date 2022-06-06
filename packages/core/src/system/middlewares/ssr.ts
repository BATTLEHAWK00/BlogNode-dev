import config from '@src/config';
import { Timer } from '@src/util/utils';
import NextApp, { NextConfig } from 'next';

import bus from '../bus';
import { EventType } from '../events';
import logging from '../logging';
import { KoaMiddleware, ServerMiddleware } from '../middleware';
import ThemeProcessor from '../theme';

const defaultNextConfig:NextConfig = {
  distDir: config.isDev ? '.next/development' : '.next',
  pageExtensions: ['tsx'],
  cleanDistDir: true,
};

class SsrMiddleware extends ServerMiddleware {
  private timer = new Timer();

  private theme?:ThemeProcessor;

  private nextApp?:any;

  protected setName(): string {
    return 'SSR';
  }

  async beforeSetting(): Promise<void> {
    logging.systemLogger.debug('Initializing SSR engine...');
    this.timer.start();
    setTimeout(() => {
      if (!this.timer.isStopped()) {
        const errMsg = 'SSR Engine start timed out!';
        throw new Error(errMsg);
      }
    }, 20000);
    this.theme = new ThemeProcessor(config.systemConfig.themeDir);
    await this.theme.register();
    logging.systemLogger.info(`Registered theme: ${this.theme.getThemeName()}`);
    logging.systemLogger.debug(`Theme location: ${this.theme.getThemeDir()}`);
  }

  afterSetting(): void | Promise<void> {
    bus.once(EventType.SYS_BeforeSystemStop, async () => {
      logging.systemLogger.debug('Closing SSR engine...');
      await this.nextApp.close();
    });

    this.timer.end();
    logging.systemLogger.debug(`SSR engine initialization complete.(${this.timer.result()}ms)`);
  }

  async getKoaMiddleware(): Promise<KoaMiddleware> {
    this.nextApp = NextApp({
      dev: config.isDev,
      dir: this.theme?.getThemeDir(),
      conf: { ...defaultNextConfig },
    });
    if (!this.nextApp) throw new Error('SSR initialization failed!');
    this.nextApp.options.quiet = true;
    await this.nextApp.prepare();
    const nextHandler = this.nextApp.getRequestHandler();
    this.getKoaRouter().all('(.*)', async (ctx) => {
      await nextHandler(ctx.req, ctx.res);
      ctx.respond = false;
    });
    return async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    };
  }
}

export default new SsrMiddleware();
