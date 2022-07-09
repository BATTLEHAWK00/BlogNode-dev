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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pageMap: Map<string, ReactComponent<any>> = new Map();

  constructor(pagePath: string) {
    this.pagePath = pagePath;
  }

  async render(serverCtx: Context, pageCtx: unknown, pageName: string): Promise<string> {
    console.log(pageCtx);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pageComponent: ReactComponent<any>;
    if (this.pageMap.has(pageName)) pageComponent = this.pageMap.get(pageName);
    else {
      const pageFilePath = path.resolve(this.pagePath, pageName);
      if (!fs.existsSync(pageFilePath)) throw new Error(`Page not exists: ${pageName}`);
      pageComponent = (await import(pageFilePath)).default;
    }
    return domserver.renderToString(blogNodeRoot({ pageCtx, Com: pageComponent }));
  }
}

let renderer: ReactRenderer;

function configure(ctx: SsrConfig): void {
  renderer = new ReactRenderer(ctx.themeDir);
}

function render(serverCtx: Context, pageCtx: unknown, pageName: string): Promise<string> {
  if (!renderer) throw new Error('Renderer not configured yet!');
  return renderer.render(serverCtx, pageCtx, pageName);
}

export default {
  configure,
  render,
};
