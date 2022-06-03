import KoaApp from 'koa';
import KoaRouter from 'koa-router';
import nextModule from '@blognode/next';
import config from '@src/config';
import logging from '../logging';

nextModule.registerThemePackage(config.systemConfig.themeDir);

logging.systemLogger.info(`Registered theme: ${nextModule.getRegisteredTheme()}`);

const nextApp = nextModule.getNextApp();
const nextHandler = nextApp.getRequestHandler();
nextApp.options.quiet = true;

function prepare(koaApp: KoaApp, koaRouter: KoaRouter, onComplete: () => void) {
  nextApp.prepare().then(() => {
    koaRouter.all('(.*)', async (ctx) => {
      await nextHandler(ctx.req, ctx.res);
      ctx.respond = false;
    });

    koaApp.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    onComplete();
  });
}

export default {
  prepare,
};
