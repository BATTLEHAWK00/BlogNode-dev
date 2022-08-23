/* eslint-disable max-classes-per-file */
import type { LinkTag, ScriptTag } from '@src/util/template';
import type {
  Context, Middleware, Next, Request, Response,
} from 'koa';

const HttpMethods = ['get', 'post', 'put', 'delete'] as const;

export interface PageResult{
  pageTitle: string
  pageLang: string
  scriptTags: ScriptTag[]
  linkTags: LinkTag[]
  pageCtx: unknown
  pageName: string
}

export interface ApiResult{
  code: number
  msg: string
  data: unknown
}

export interface BlogNodeContext extends Context{
  pageCtx?: PageResult
}

export interface HandlerContext {
  path: string
  query: Record<string, unknown>
  params: Record<string, unknown>
  req: Request
  res: Response
}

type GetHandlerContext = Omit<HandlerContext, 'params'>;

export interface PageHandler {
  get?: (ctx: GetHandlerContext)=> Promise<PageResult>;
  post?: (ctx: HandlerContext)=> Promise<PageResult>;
}

export interface ApiHandler {
  get?: (ctx: GetHandlerContext)=> Promise<ApiResult>;
  put?: (ctx: HandlerContext)=> Promise<ApiResult>;
  post?: (ctx: HandlerContext)=> Promise<ApiResult>;
  delete?: (ctx: HandlerContext)=> Promise<ApiResult>;
}

abstract class Handler {
  private req: Request;

  private res: Response;

  constructor({ request, response }: Context) {
    this.req = request;
    this.res = response;
  }

  getRequest() {
    return this.req;
  }

  getResponse() {
    return this.res;
  }

  setCode(code: number) {
    this.res.status = code;
  }

  redirect(url: string) {
    return () => this.res.redirect(url);
  }
}

export abstract class PageHandler extends Handler {
  private title = 'untitled';
  private pageScripts = [];
  private pageLinks = [];
  private pageCtx = {};
  private pageName?: string;

  setTitle(title: string): void {
    this.title = title;
  }
}

interface JsonResponse<T>{
  code: number
  msg: string
  data: T
}

export abstract class ApiHandler extends Handler {
  success<T>(data: T): JsonResponse<T> {
    return { code: 200, msg: 'OK', data };
  }
}

export function getHandlerMiddleware<T extends ApiHandler | PageHandler>(
  RequestHandler: new(ctx: Context)=> T,
): Middleware {
  async function handlePage(ctx: BlogNodeContext, handler: PageHandler) {
    ctx.type = 'text/html';
    if (['put', 'delete'].includes(ctx.method)) handler.setCode(405);
    const method = ctx.method as Exclude<typeof HttpMethods[number], 'put' | 'delete'>;
    const pageResult = await handler[method]?.({
      path: ctx.path,
      query: ctx.query,
      params: ctx.request.body || {},
      req: ctx.request,
      res: ctx.response,
    });
    if (pageResult) ctx.pageCtx = pageResult;
  }

  async function handleApi(ctx: Context, handler: ApiHandler) {
    ctx.type = 'application/json';
    const method = ctx.method as typeof HttpMethods[number];
    const apiResult = await handler[method]?.({
      path: ctx.path,
      query: ctx.query,
      params: ctx.request.body || {},
      req: ctx.request,
      res: ctx.response,
    });
    if (apiResult) ctx.body = apiResult;
  }

  return async (ctx: Context, next: Next) => {
    const handler = new RequestHandler(ctx);
    if (handler instanceof PageHandler) await handlePage(ctx, handler);
    else if (handler instanceof ApiHandler) await handleApi(ctx, handler);
    await next();
  };
}
