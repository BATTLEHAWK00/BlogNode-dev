import config from '@src/config';
import { Timer } from '@src/util/utils';
import KoaApp from 'koa';
import KoaRouter from 'koa-router';
import path from 'path';

import bus from '../bus';
import { EventType } from '../events';
import logging from '../logging';

async function prepare(koaApp: KoaApp, koaRouter: KoaRouter) {
  const timer = new Timer();
  logging.systemLogger.info('Initializing SSR engine...');
  timer.start();

  const nextModule = (await import('@blognode/next')).default

  await nextModule.registerThemePackage(config.systemConfig.themeDir);
  logging.systemLogger.info(`Registered theme: ${path.basename(nextModule.getRegisteredTheme())}`);
  logging.systemLogger.debug(`Theme location: ${nextModule.getRegisteredTheme()}`);

  const nextApp = nextModule.getNextApp();
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
