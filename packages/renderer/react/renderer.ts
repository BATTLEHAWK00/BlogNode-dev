import type { Component, FunctionComponent } from 'react';
import * as domserver from 'react-dom/server';
import blogNodeRoot from './root';

type ReactComponent<T extends Component | FunctionComponent> = T;

class ReactRenderer {
  private dev: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pageMap: Map<string, ReactComponent<any>> = new Map();

  constructor(dev: boolean) {
    this.dev = dev;
  }

  async render(template: string, layout: string, payload: unknown): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pageComponent: ReactComponent<any>;

    return domserver.renderToString(blogNodeRoot(payload, pageComponent));
  }
}

let renderer: ReactRenderer;

async function prepare(): Promise<void> {
  renderer = new ReactRenderer(false);
}

function render(template: string, layout: string, payload: unknown): Promise<string> {
  if (!renderer) throw new Error('Renderer not configured yet!');
  return renderer.render(template, layout, payload);
}

export default {
  prepare,
  render,
};
