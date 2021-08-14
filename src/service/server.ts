import Koa from 'koa';
import nunjucks from 'nunjucks';
import Router from 'koa-router';
import { Logger } from './logger';
import ErrorHandler from '../handler/errorhandler';

const app = new Koa();
const router = new Router();
const logger = new Logger('service/server');

// const SECRET = process.env.SECRET || 'faekkkeee00$';
const PORT = process.env.PORT || 3000;
// const COUCHBASE_URI = process.env.COUCHBASE_URI || 'couchbase://127.0.0.1';
// const COUCHBASE_BUCK = process.env.COUCHBASE_BUCKET || 'default';
// const PASSWORD = process.env.PASSWORD || 'superfakepassword';

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

router.all('*', ErrorHandler);

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
