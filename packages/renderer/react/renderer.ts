import type { Component, FunctionComponent } from 'react';
import * as domserver from 'react-dom/server';
import * as path from 'path';
import * as fs from 'fs';
import { SsrConfig } from 'blognode';
import { Context } from 'koa';
import blogNodeRoot from './root';

type ReactComponent<T extends Component | FunctionComponent> = T;

class ReactRenderer {
  private pagePath: string;

  private dev: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pageMap: Map<string, ReactComponent<any>> = new Map();

  constructor(pagePath: string, dev: boolean) {
    this.pagePath = pagePath;
    this.dev = dev;
    console.log(dev);
  }

  async render(serverCtx: Context, pageCtx: unknown, pageName: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pageComponent: ReactComponent<any>;
    if (this.pageMap.has(pageName)) pageComponent = this.pageMap.get(pageName);
    else {
      const pageFilePath = path.resolve(this.pagePath, path.extname(pageName) ? pageName : `${pageName}.js`);
      if (this.dev) {
        fs.watchFile(pageFilePath, { interval: 200 }, async () => {
          pageComponent = (await import(pageFilePath)).default;
          this.pageMap.set(pageName, pageComponent);
          __blognode.logging?.systemLogger.debug(`Reloaded page template: ${pageName}`);
        });
      }
      if (!fs.existsSync(pageFilePath)) throw new Error(`Page not exists: ${pageName}`);
      pageComponent = (await import(pageFilePath)).default;
      this.pageMap.set(pageName, pageComponent);
    }
    return domserver.renderToString(blogNodeRoot(pageCtx, pageComponent));
  }
}

let renderer: ReactRenderer;

function configure(ctx: SsrConfig): void {
  renderer = new ReactRenderer(ctx.themeDir, ctx.isDev);
}

function render(serverCtx: Context, pageCtx: unknown, pageName: string): Promise<string> {
  if (!renderer) throw new Error('Renderer not configured yet!');
  return renderer.render(serverCtx, pageCtx, pageName);
}

export default {
  configure,
  render,
};
