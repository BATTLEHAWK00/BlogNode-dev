/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PageHandler, ApiHandler } from '@util/handler';

if (!__blognode.routerRegistry) throw new Error('Blognode not fully initialized!');

const {
  registerApiRoute,
  registerPageRoute,
} = __blognode.routerRegistry;

type PageMethods = 'get' | 'post';
type ApiMethods = 'get' | 'post' | 'put' | 'del';

export default function RegisterRoutes() {
  const handlers = require.context('./handlers', true, /\.ts$/);
  handlers.keys()
    .map((k) => handlers(k))
    .forEach(({ default: m }) => {
      if (m instanceof PageHandler) {
        const methods: PageMethods[] = ['get', 'post'];
        methods
          .filter((method) => method in m)
          .forEach((method) => {
            // @ts-ignore
            registerPageRoute(method, m.getName(), m.getPath(), m[method]);
          });
      } else if (m instanceof ApiHandler) {
        const methods: ApiMethods[] = ['get', 'post', 'put', 'del'];
        methods
          .filter((method) => method in m)
          .forEach((method) => {
            // @ts-ignore
            registerApiRoute(method, m.getName(), m.getPath(), m[method]);
          });
      }
    });
}
