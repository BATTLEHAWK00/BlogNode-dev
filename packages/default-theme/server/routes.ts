/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PageHandler, ApiHandler } from '@util/handler';
import type { Context } from 'koa';
import { HandlerContext } from 'blognode/src/handler/handler';
import { Asyncable } from './util/common';

if (!__blognode.routerRegistry) throw new Error('Blognode not fully initialized!');

const {
  registerApiRoute,
  registerPageRoute,
} = __blognode.routerRegistry;

type PageMethods = 'get' | 'post';
type ApiMethods = 'get' | 'post' | 'put' | 'del';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerMethod<T> = (ctx: HandlerContext)=> Asyncable<T>;

function handleRequest<T, K extends HandlerMethod<T>>(method: K) {
  return (ctx: Context) => method({
    path: ctx.path,
    query: ctx.query,
    params: ctx.request.body,
    req: ctx.request,
    res: ctx.response,
  });
}

export default function RegisterRoutes() {
  const handlers = require.context('./handlers', true, /\.ts$/);
  handlers.keys()
    .map((k) => handlers(k))
    .forEach(({ default: m }) => {
      if (m instanceof PageHandler) {
        const methods: PageMethods[] = ['get', 'post'];
        methods.filter((method) => method in m)
          .forEach((method) => {
            const handler = m[method];
            if (!handler) throw new Error('Handler not defined.');
            registerPageRoute(method, m.getName(), m.getPath(), handleRequest(handler));
          });
      } else if (m instanceof ApiHandler) {
        const methods: ApiMethods[] = ['get', 'post', 'put', 'del'];
        methods.filter((method) => method in m)
          .forEach((method) => {
            const handler = m[method];
            if (!handler) throw new Error('Handler not defined.');
            registerApiRoute(method, m.getName(), m.getPath(), handleRequest(handler));
          });
      }
    });
}
