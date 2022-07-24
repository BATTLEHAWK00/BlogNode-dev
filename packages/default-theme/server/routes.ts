import { PageHandler, ApiHandler } from './util/handler';

if (!__blognode.routerRegistry) throw new Error('Blognode not fully initialized!');

const { registerApiRoute, registerPageRoute } = __blognode.routerRegistry;

export default function RegisterRoutes() {
  const handlers = require.context('./handlers', true, /\.ts$/);
  handlers.keys()
    .map((k) => handlers(k))
    .forEach(({ default: m }) => {
      if (m instanceof PageHandler) {
        const methods = ['get', 'post'];
        methods.filter((method) => m[method])
          .forEach((method) => {
            registerPageRoute(method, m.getName(), m.getPath(), m[method]);
          });
      } else if (m instanceof ApiHandler) {
        const methods = ['get', 'post', 'put', 'del'];
        methods.filter((method) => m[method])
          .forEach((method) => {
            registerApiRoute(method, m.getName(), m.getPath(), m[method]);
          });
      }
    });
}
