import Koa from 'koa';
import nunjucks from 'nunjucks';
import Router from 'koa-router';
import { Logger } from './logger';
import { handle } from './controller';
// import ErrorHandler from '../handler/errorhandler';

const app = new Koa();
const router = new Router();
const logger = new Logger('service/server');

const PORT = process.env.PORT || 3000;

type CtxType = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>;

nunjucks.configure('./src/ui/themes/default', { autoescape: true });

/**
 * 计算响应时间中间件
 * @param {ctxType} ctx
 * @param {Koa.Next} next
 */
async function calResponseTime(ctx:CtxType, next:Koa.Next) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}ms`);
}

// async function handle(ctx, HandlerClass) {
//   const args = {
//     ...ctx.params,
//     ...ctx.query,
//     ...ctx.request.body,
//   };
//   const h = new HandlerClass(ctx);
//   h.args = args;
//   try {
//     const method = ctx.method.toLowerCase();

//     await h.init(args);
//   } catch (e) {
//     try {
//       await h.onerror(e);
//     } catch (err) {
//       h.response.code = 500;
//       // h.response.body = `${err.message}\n${err.stack}`;
//     }
//   }
// }

export function RegisterRoute(name:string, path:string, handler:any) {
  router.all(name, path, handler);
}

import TestController from '../controller/test'

router.all('test', '/', (ctx) => handle(ctx, TestController.TestController));

// 中间件集合
const middleWares = [
  calResponseTime,
  router.routes(),
  router.allowedMethods(),
];

// 服务器入口
async function start() {
  middleWares.forEach((middleWare) => app.use(middleWare));
  app.listen(PORT);
  logger.success(`server listening at ${PORT}`);
}

export default {
  start,
};
