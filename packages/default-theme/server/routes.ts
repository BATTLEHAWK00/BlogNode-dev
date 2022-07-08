import { RegisterApiRoute, RegisterPageRoute } from 'blognode';

export default function RegisterRoutes() {
  RegisterPageRoute('get', 'test', '/', async () => {
    console.log('test');

    return {
      pagePath: 'search',
      pageCtx: {},
    };
  });
  RegisterApiRoute('get', 'test2', '/test', async () => ({ state: 200, msg: 'ok', result: { test: true } }));
  RegisterApiRoute('get', 'login', '/auth/login', async (ctx) => {
    ctx.cookies.set('blognode-auth');
  });
}
