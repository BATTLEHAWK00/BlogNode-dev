import { RegisterRoute } from 'blognode';
import type { Context } from 'koa';

export default function RegisterRoutes() {
  console.log('test');

  RegisterRoute('get', 'test', '/', async (ctx: Context) => {
    ctx.pageName = 'search';
    ctx.pageCtx = { name: 'test' };
  });
}
