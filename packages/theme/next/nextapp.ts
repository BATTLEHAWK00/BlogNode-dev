/* eslint-disable max-classes-per-file */
import { Context } from 'koa';
import NextApp, { NextConfig } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import { SsrConfig } from 'blognode';
import Server from 'next/dist/server/base-server';

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

interface NextServer {
  // getRequestHandler(): RequestHandler;
  setAssetPrefix(assetPrefix: string): void;
  logError(...args: Parameters<Server['logError']>): void;
  render(...args: Parameters<Server['render']>): Promise<void>;
  renderToHTML(...args: Parameters<Server['renderToHTML']>): Promise<string | null>;
  renderError(...args: Parameters<Server['renderError']>): Promise<void>;
  renderErrorToHTML(...args: Parameters<Server['renderErrorToHTML']>): Promise<string | null>;
  render404(...args: Parameters<Server['render404']>): Promise<void>;
  prepare(): Promise<void>;
  close(): Promise<void>;
}

class NextRenerer {
  private app: NextServer;

  constructor(app: NextServer) {
    this.app = app;
  }

  // async render(req: IncomingMessage, res: ServerResponse, view: string, pageProps?: unknown) {
  //   if (pageProps) req.BlogNodeContext.pageProps = pageProps;
  //   this.app.render(req, res, view);
  // }

  async renderToHtml(req: IncomingMessage, res: ServerResponse, view: string, pageProps?: unknown) {
    if (pageProps) req.BlogNodeContext.pageProps = pageProps;
    return this.app.renderToHTML(req as never, res as never, view);
  }

  // async render404(req: IncomingMessage, res: ServerResponse, pageProps?: unknown) {
  //   if (pageProps) req.BlogNodeContext.pageProps = pageProps;
  //   this.app.render404(req, res);
  // }

  // async renderErrorToHtml(req: IncomingMessage, res: ServerResponse, view: string, error: Error, pageProps?: unknown) {
  //   if (pageProps) req.BlogNodeContext.pageProps = pageProps;
  //   return await this.app.renderErrorToHTML(error, req, res, view) || '';
  // }
}

class NextInstance {
  private nextApp?: NextServer;

  private renderer?: NextRenerer;

  init(ctx: SsrConfig): void {
    const { themeDir, isDev } = ctx;
    this.nextApp = NextApp({
      dev: isDev,
      dir: themeDir,
    });

    this.renderer = new NextRenerer(this.nextApp);
  }

  prepare(): Promise<void> {
    if (!this.nextApp) throw new Error();
    return this.nextApp.prepare();
  }

  close(): Promise<void> {
    if (!this.nextApp) throw new Error();
    return this.nextApp.close();
  }

  async render(koaCtx: Context): Promise<string | null> {
    if (!this.renderer) throw new Error();
    if (!koaCtx.pageName) return null;
    return this.renderer.renderToHtml(koaCtx.req, koaCtx.res, koaCtx.pageName, koaCtx.pageCtx);
  }
}

const nextInstance = new NextInstance();

function configure(ctx: SsrConfig): void {
  nextInstance.init(ctx);
}

export default {
  middleware: nextInstance,
  configure,
};
