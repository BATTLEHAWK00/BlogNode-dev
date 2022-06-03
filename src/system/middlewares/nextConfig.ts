import KoaApp from 'koa';
import KoaRouter from 'koa-router';
import Next from 'next';

const isDev = process.env.NODE_ENV === 'development';
const nextApp = Next({ dev: isDev });
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
