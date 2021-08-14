import Koa from 'koa';
import nunjucks from 'nunjucks';
import Router from 'koa-router';
import { Logger } from './logger';

const app = new Koa();
const router = new Router();
const logger = new Logger('service/server');

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

router.get('/test', async (ctx, next) => {
  ctx.set('templateFile', 'index.html');
  next();
});

// 模板处理
router.get('/test', async (ctx) => {
  ctx.body = nunjucks.render('index.njk', {});
});

// 中间件集合
const middleWares = [
  calResponseTime,
  router.routes(),
];

/**
 * 启动方法
 */
export default async function start() {
  middleWares.forEach((middleWare) => app.use(middleWare));
  app.listen(3000);
}
