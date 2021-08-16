import Koa from 'koa';

type HttpMethodsType = 'get' | 'post' | 'put' | 'delete';

const HttpMethods: HttpMethodsType[] = ['get', 'post', 'put', 'delete'];

export class Controller {
  protected ctx:Koa.Context;

  constructor(ctx:Koa.Context) {
    this.ctx = ctx;
  }
}

export async function handle(ctx:Koa.Context, HandlerClass:any) {
  const handler = new HandlerClass(ctx);
  const method = ctx.method.toLowerCase();
  if (handler[method]) await handler[method]();
}
