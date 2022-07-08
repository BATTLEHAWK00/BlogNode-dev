import * as path from 'path';
import type { Context } from 'koa';
import { ThemeRegisterer, RegisterRoute } from 'blognode';

const isDev = process.env.NODE_ENV === 'development';

const { systemDao } = __blognode.dao;

function routes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RegisterRoute('get', 'test', '/', async (ctx: Context) => {
    ctx.pageName = 'test';
    if (systemDao) ctx.body = await systemDao.getSystemSetting('blogName');
  });
}

const register: ThemeRegisterer = () => ({
  themePath: path.resolve(__dirname, '../../'),
  themeName: 'default-theme',
  staticDir: path.resolve(__dirname, '../.next/static/'),
  staticPrefix: '/_next/static',
  ssrMiddleware: '@blognode/middleware-next',
  registerRoutes: routes,
});

export default register;
