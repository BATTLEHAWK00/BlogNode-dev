import { ApiHandler, getHandlerMiddleware, PageHandler } from '@src/handler/handler';
import { Awaitable } from '@src/util/types';
import { Context } from 'koa';
import Router = require('koa-router');
import { ScriptTag, LinkTag } from '../util/template';

const router = new Router();

export interface JsonResponseContext<T> {
  state: number
  msg: string
  result: T
}

export interface HtmlResponseContext<T> {
  pageName: string
  pageTitle?: string
  pageCtx: T
  pageScripts: ScriptTag[]
  pageLinks: LinkTag[]
}

function registerRoute<T extends ApiHandler | PageHandler>(
  name: string,
  path: string,
  RequestHandler: new(ctx: Context)=> T,
): void {
  const middleware = getHandlerMiddleware(RequestHandler);
  router.all(name, path, middleware);
}

function getRoutes(): Router.IMiddleware {
  return router.routes();
}

function getRouterSize(): number {
  return router.stack.length;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  registerRoute,
  getRoutes,
  getRouterSize,
};

export default _default;

__blognode.routerRegistry = _default;
