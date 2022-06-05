import config from '@src/config';
import { Timer } from '@src/util/utils';
import KoaApp from 'koa';
import KoaRouter from 'koa-router';

import bus from '../bus';
import { EventType } from '../events';
import logging from '../logging';
import theme from '../theme';

async function prepare(koaApp: KoaApp, koaRouter: KoaRouter) {
  const timer = new Timer();
  logging.systemLogger.info('Initializing SSR engine...');
  timer.start();

  const themeRegisterer = theme.getThemeRegisterer(config.systemConfig.themeDir);
  await themeRegisterer.register();
  logging.systemLogger.info(`Registered theme: ${themeRegisterer.getThemeName()}`);
  logging.systemLogger.debug(`Theme location: ${themeRegisterer.getThemeDir()}`);

  const nextApp = await themeRegisterer.getNextApp();
  const nextHandler = nextApp.getRequestHandler();
  nextApp.options.quiet = true;

  await nextApp.prepare();

  koaRouter.all('(.*)', async (ctx) => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  koaApp.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  bus.once(EventType.SYS_BeforeSystemStop, async () => {
    logging.systemLogger.debug('Closing SSR engine...');
    await nextApp.close();
  });

  timer.end();
  logging.systemLogger.info(`SSR engine initialization complete.(${timer.result()}ms)`);
}

export default {
  prepare,
};
