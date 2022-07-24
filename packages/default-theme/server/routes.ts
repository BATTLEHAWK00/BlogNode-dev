const { registerApiRoute, registerPageRoute } = __blognode.routerRegistry;

export default function RegisterRoutes() {
  registerPageRoute('get', 'test', '/', async () => ({
    pagePath: 'homepage',
    pageCtx: {
      test: 'asdasdas',
    },
    pageLinks: [
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'static/main.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'static/components.css',
      },
    ],
    pageScripts: [
      {
        src: 'static/main.js',
        defer: true,
        async: true,
      },
      {
        src: 'static/components.js',
        defer: true,
        async: true,
      },
    ],
  }));
  registerPageRoute('get', 'test', '/search', async () => ({
    pagePath: 'search',
    pageCtx: {},
  }));
  registerPageRoute('get', 'test', '/auth/login', async () => ({
    pagePath: 'login',
    pageCtx: {},
  }));
  registerApiRoute('get', 'test2', '/test', async () => ({ state: 200, msg: 'ok', result: { test: true } }));
  console.log('asd');

  // RegisterApiRoute('get', 'login', '/auth/login', async (ctx) => {
  //   c;
  // });
}
