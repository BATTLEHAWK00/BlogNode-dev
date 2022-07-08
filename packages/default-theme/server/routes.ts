import { RegisterRoute } from 'blognode';
import type { Context } from 'koa';

export default function RegisterRoutes() {
  RegisterRoute('get', 'test', '/search', async (ctx: Context) => {
    ctx.pageName = 'search';
    ctx.pageCtx = { name: 'test' };
  });
}
