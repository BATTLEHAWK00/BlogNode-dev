import { Context, Next } from 'koa';
import NextApp, { NextConfig } from 'next';
import { IncomingMessage, ServerResponse } from 'http';

export interface BlogNodeContext{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps?: any
}

declare module 'http'{
  interface IncomingMessage{
    BlogNodeContext: BlogNodeContext
  }
}

declare module 'koa'{
  interface Context{
    render: (view: string, pageProps?: unknown)=> Promise<void>
    renderToHtml: (view: string, pageProps?: unknown)=> Promise<string>
    render404: (view: string, pageProps?: unknown)=> Promise<void>
    renderErrorToHtml: (view: string, error: Error, pageProps?: unknown)=> Promise<string>
  }
}

export interface NextOptions{
  dev: boolean
  dir: string
  quiet?: boolean
  config: NextConfig
}

type KoaMiddleware = (ctx: Context, next: Next)=> Promise<void>;

export default async function middleware(nextOptions: NextOptions): Promise<KoaMiddleware> {
  const app = NextApp(nextOptions);
  await app.prepare();

  async function render(req: IncomingMessage, res: ServerResponse, view: string, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    app.render(req, res, view);
  }

  async function renderToHtml(req: IncomingMessage, res: ServerResponse, view: string, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    return await app.renderToHTML(req, res, view) || '';
  }

  async function render404(req: IncomingMessage, res: ServerResponse, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    app.render404(req, res);
  }

  async function renderErrorToHtml(req: IncomingMessage, res: ServerResponse, view: string, error: Error, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    return await app.renderErrorToHTML(error, req, res, view) || '';
  }

  async function handle(ctx: Context, next: Next) {
    const { req, res } = ctx;
    ctx.render = (view, pageProps) => render(req, res, view, pageProps);
    ctx.render404 = (pageProps) => render404(req, res, pageProps);
    ctx.renderToHtml = (view, pageProps) => renderToHtml(req, res, view, pageProps);
    ctx.renderErrorToHtml = (view, error, pageProps) => renderErrorToHtml(req, res, view, error, pageProps);
    next();
  }

  return handle;
}
