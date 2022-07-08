import { Awaitable } from '@src/util/types';
import { Context, Next } from 'koa';
import Router = require('koa-router');

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
    const { pageCtx, pagePath } = await handler(ctx);
    ctx._ssrCtx = pageCtx;
    ctx._pageName = pagePath;
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

export default {
  registerApiRoute,
  registerPageRoute,
  getRoutes,
  getRouterSize,
};
