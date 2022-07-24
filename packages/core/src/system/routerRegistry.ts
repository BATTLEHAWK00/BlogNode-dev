import { Awaitable } from '@src/util/types';
import { Context, Next } from 'koa';
import Router = require('koa-router');
import { ScriptTag, LinkTag } from '../util/template';

const router = new Router();

export type HttpMethods = 'get' | 'post';

export interface JsonResponseContext<T>{
  state: number
  msg: string
  result: T
}

export interface HtmlResponseContext<T>{
  pagePath: string
  pageTitle?: string
  pageCtx: T
  pageScripts: ScriptTag[]
  pageLinks: LinkTag[]
}

type JsonResponseHandler<T> = (ctx: Context)=> Awaitable<JsonResponseContext<T>>;
type PageResponseHandler<T> = (ctx: Context)=> Awaitable<HtmlResponseContext<T>>;

function registerApiRoute<T>(method: HttpMethods | HttpMethods[], name: string, path: string | RegExp, handler: JsonResponseHandler<T>): void {
  const handle = async (ctx: Context, next: Next) => {
    ctx.body = await handler(ctx);
    ctx.type = 'application/json';
    next();
  };
  if (method instanceof Array) method.forEach((m) => router[m](name, path, handle));
  else router[method](name, path, handle);
}

function registerPageRoute<T>(method: HttpMethods | HttpMethods[], name: string, path: string | RegExp, handler: PageResponseHandler<T>): void {
  const handle = async (ctx: Context, next: Next) => {
    const {
      pageCtx, pagePath, pageScripts, pageLinks,
    } = await handler(ctx);
    ctx._pageCtx = pageCtx;
    ctx._pageName = pagePath;
    ctx._pageScripts = pageScripts;
    ctx._pageLinks = pageLinks;
    ctx.type = 'text/html';
    next();
  };
  if (method instanceof Array) method.forEach((m) => router[m](name, path, handle));
  else router[method](name, path, handle);
}

function getRoutes(): Router.IMiddleware {
  return router.routes();
}

function getRouterSize(): number {
  return router.stack.length;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  registerApiRoute,
  registerPageRoute,
  getRoutes,
  getRouterSize,
};

export default _default;

__blognode.routerRegistry = _default;
