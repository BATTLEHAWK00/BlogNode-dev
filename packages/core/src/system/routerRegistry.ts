import Router = require('koa-router');

const router = new Router();

export type HttpMethods = 'get' | 'post';

function registerRoute(method: HttpMethods | HttpMethods[], name: string, path: string | RegExp, middleware: Router.IMiddleware): void {
  if (method instanceof Array) method.forEach((m) => router[m](name, path, middleware));
  else router[method](name, path, middleware);
}

function getRoutes(): Router.IMiddleware {
  return router.routes();
}

function getRouterSize(): number {
  return router.stack.length;
}

export default {
  registerRoute,
  getRoutes,
  getRouterSize,
};
