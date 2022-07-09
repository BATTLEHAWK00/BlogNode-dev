import { RegisterApiRoute, RegisterPageRoute } from 'blognode';

export default function RegisterRoutes() {
  RegisterPageRoute('get', 'test', '/', async () => ({
    pagePath: 'homepage',
    pageCtx: {},
  }));
  RegisterPageRoute('get', 'test', '/search', async () => ({
    pagePath: 'search',
    pageCtx: {},
  }));
  RegisterPageRoute('get', 'test', '/auth/login', async () => ({
    pagePath: 'login',
    pageCtx: {},
  }));
  RegisterApiRoute('get', 'test2', '/test', async () => ({ state: 200, msg: 'ok', result: { test: true } }));
  // RegisterApiRoute('get', 'login', '/auth/login', async (ctx) => {
  //   c;
  // });
}
