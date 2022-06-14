import { Context, Next } from 'koa';
import NextApp, { NextConfig, RequestHandler } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import Server from 'next/dist/server/base-server';
import { BaseNextRequest } from 'next/dist/server/base-http';

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

interface NextServer {
  getRequestHandler(): RequestHandler;
  setAssetPrefix(assetPrefix: string): void;
  logError(...args: Parameters<Server['logError']>): void;
  render(...args: Parameters<Server['render']>): Promise<void>;
  renderToHTML(...args: Parameters<Server['renderToHTML']>): Promise<string | null>;
  renderError(...args: Parameters<Server['renderError']>): Promise<void>;
  renderErrorToHTML(...args: Parameters<Server['renderErrorToHTML']>): Promise<string | null>;
  render404(...args: Parameters<Server['render404']>): Promise<void>;
  prepare(): Promise<void>;
  close(): Promise<any>;
}

class NextRenerer {
  private app: NextServer;

  constructor(app: NextServer) {
    this.app = app;
  }

  async render(req: IncomingMessage, res: ServerResponse, view: string, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    this.app.render(req, res, view);
  }

  async renderToHtml(req: IncomingMessage, res: ServerResponse, view: string, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    return await this.app.renderToHTML(req, res, view) || '';
  }

  async render404(req: IncomingMessage, res: ServerResponse, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    this.app.render404(req, res);
  }

  async renderErrorToHtml(req: IncomingMessage, res: ServerResponse, view: string, error: Error, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    return await this.app.renderErrorToHTML(error, req, res, view) || '';
  }
}

export default async function middleware(nextOptions: NextOptions): Promise<KoaMiddleware> {
  const app = NextApp(nextOptions);
  await app.prepare();
  const server = new NextRenerer(app);

  async function handle(ctx: Context, next: Next) {
    const { req, res } = ctx;
    ctx.render = (view, pageProps) => server.render(req, res, view, pageProps);
    ctx.render404 = (pageProps) => server.render404(req, res, pageProps);
    ctx.renderToHtml = (view, pageProps) => server.renderToHtml(req, res, view, pageProps);
    ctx.renderErrorToHtml = (view, error, pageProps) => server.renderErrorToHtml(req, res, view, error, pageProps);
    next();
  }

  return handle;
}
