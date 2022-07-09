/* eslint-disable max-classes-per-file */
import { Context } from 'koa';
import NextApp, { NextConfig, RequestHandler } from 'next';
import { SsrConfig } from 'blognode';
import Server from 'next/dist/server/base-server';

export interface BlogNodeContext{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps?: any
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
  getRequestHandler(): RequestHandler;
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

  async renderToHtml(koaCtx: Context, viewPath: string) {
    const { req, res } = koaCtx;
    if (koaCtx.pageCtx) req._ssrCtx = koaCtx.pageCtx;
    return this.app.renderToHTML(req as never, res as never, viewPath, {
      ...koaCtx.query,
    });
  }
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
    if (!koaCtx._pageName) return null;
    return this.renderer.renderToHtml(koaCtx, koaCtx._pageName);
  }

  getRequestHandler() {
    return this.nextApp?.getRequestHandler();
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
