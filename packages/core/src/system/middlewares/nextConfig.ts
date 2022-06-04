import KoaApp from 'koa';
import KoaRouter from 'koa-router';
import path from 'path';
import nextModule from '@blognode/next';
import config from '@src/config';
import { Timer } from '@src/util/utils';
import logging from '../logging';

nextModule.registerThemePackage(config.systemConfig.themeDir);

logging.systemLogger.info(`Registered theme: ${path.basename(nextModule.getRegisteredTheme())}`);
logging.systemLogger.debug(`Theme location: ${nextModule.getRegisteredTheme()}`);

const nextApp = nextModule.getNextApp();
const nextHandler = nextApp.getRequestHandler();
nextApp.options.quiet = true;

function prepare(koaApp: KoaApp, koaRouter: KoaRouter, onComplete: () => void) {
  const timer = new Timer();
  logging.systemLogger.info('Initializing next.js...');
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
    logging.systemLogger.info(`Next.js initialization complete.(${timer.result()}ms)`);
    onComplete();
  });
}

export default {
  prepare,
};
