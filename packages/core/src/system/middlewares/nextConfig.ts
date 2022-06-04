import KoaApp from 'koa';
import KoaRouter from 'koa-router';
import path from 'path';
import nextModule from '@blognode/next';
import config from '@src/config';
import { Timer } from '@src/util/utils';
import logging from '../logging';
import bus from '../bus';
import { EventType } from '../events';

nextModule.registerThemePackage(config.systemConfig.themeDir);

logging.systemLogger.info(`Registered theme: ${path.basename(nextModule.getRegisteredTheme())}`);
logging.systemLogger.debug(`Theme location: ${nextModule.getRegisteredTheme()}`);

const nextApp = nextModule.getNextApp();
const nextHandler = nextApp.getRequestHandler();
nextApp.options.quiet = true;

function prepare(koaApp: KoaApp, koaRouter: KoaRouter, onComplete: () => void) {
  const timer = new Timer();
  logging.systemLogger.info('Initializing SSR engine...');
  timer.start();

  nextApp.prepare().then(() => {
    koaRouter.all('(.*)', async (ctx) => {
      await nextHandler(ctx.req, ctx.res);
      ctx.respond = false;
    });
    koaApp.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });
    timer.end();
    logging.systemLogger.info(`SSR engine initialization complete.(${timer.result()}ms)`);
    onComplete();
  });
}

bus.once(EventType.SYS_BeforeSystemStop, async () => {
  logging.systemLogger.debug('Closing SSR engine...');
  await nextApp.close();
});

export default {
  prepare,
};
