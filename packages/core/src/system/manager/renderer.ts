import { IBlogNodeRenderer } from '@blognode/types-renderer';
import { resolvePackage } from '@src/util/paths';
import { BlogNodeError } from '../error';
import logging from '../logging';
import sandbox from '../sandbox';

const logger = logging.getLogger('RendererManager');

const rendererMap: Map<string, IBlogNodeRenderer> = new Map();

async function getRenderer(name: string): Promise<IBlogNodeRenderer> {
  let renderer: IBlogNodeRenderer | undefined = rendererMap.get(name);
  if (!renderer) {
    logger.debug(`Loading renderer: ${name}`);
    const path = await resolvePackage(name);
    logger.debug(`Found renderer path: ${path}`);
    await sandbox.runModuleInSandbox(path, {
      logger: logging.getLogger('Renderer'),
      registerRenderer(r: IBlogNodeRenderer) {
        renderer = r;
        rendererMap.set(r.name, renderer);
        if (name !== r.name) rendererMap.set(name, r);
        logger.debug(`Registered renderer: ${r.name}`);
      },
    });
  }
  if (!renderer) throw new BlogNodeError(`No such renderer: ${name}`);
  return renderer;
}

export default {
  getRenderer,
};
