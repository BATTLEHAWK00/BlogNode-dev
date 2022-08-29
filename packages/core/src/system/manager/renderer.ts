import { IBlogNodeRenderer } from '@blognode/types-renderer';
import { BlogNodeError } from '../error';

const rendererMap: Map<string, IBlogNodeRenderer> = new Map();

function registerRenderer(renderer: IBlogNodeRenderer): void {
  rendererMap.set(renderer.name, renderer);
}

function getRenderer(name: string): IBlogNodeRenderer {
  const renderer = rendererMap.get(name);
  if (!renderer) throw new BlogNodeError(`No such renderer: ${name}`);
  return renderer;
}

export default {
  registerRenderer,
  getRenderer,
};
