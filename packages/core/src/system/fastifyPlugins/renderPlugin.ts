import { IBlogNodeRenderer } from '@blognode/types-renderer';
import { Timer } from '@src/util/utils';
import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fs from 'fs/promises';
import path from 'path';
import { BlogNodeError } from '../error';
import logging from '../logging';
import rendererManager from '../manager/renderer';
import theme from '../manager/theme';

type IRenderFunction = (template: string, layoutTemplate?: string)=> Promise<void>;

interface IRenderPluginOptions{
  cacheTemplates?: boolean
}

declare module 'fastify'{
  interface FastifyReply{
    render: IRenderFunction
  }
}

const logger = logging.getLogger('Render');

class RenderContext {
  private cacheEnabled: boolean;
  private cacheMap: Map<string, string> = new Map();
  private renderer: IBlogNodeRenderer;
  private templatePath: string;

  private async getTemplate(name: string) {
    if (this.cacheEnabled && this.cacheMap.has(name)) return this.cacheMap.get(name);
    const content = await fs.readFile(path.resolve(this.templatePath, name), { encoding: 'utf-8' });
    this.cacheMap.set(name, content);
    return content;
  }

  async render(templateName: string, layoutName?: string, payload?: unknown) {
    if (!layoutName) {
      const template = await this.getTemplate(templateName);
      if (!template) throw new BlogNodeError(`Template ${templateName} not found.`);
      return this.renderer.render(template, undefined, payload);
    }
    const [template, layout] = await Promise.all([
      this.getTemplate(templateName),
      this.getTemplate(layoutName),
    ]);
    if (!template) throw new BlogNodeError(`Template ${templateName} not found.`);
    if (!layout) throw new BlogNodeError(`Template ${layoutName} not found.`);
    return this.renderer.render(template, layout, payload);
  }

  constructor(renderer: IBlogNodeRenderer, templatePath: string, cache = true) {
    this.renderer = renderer;
    this.templatePath = templatePath;
    this.cacheEnabled = cache;
  }
}

const plugin: FastifyPluginCallback<IRenderPluginOptions> = async (fastify, options) => {
  const { cacheTemplates } = options;
  const { renderEngine: rendererName, templatePath } = theme.getThemeInfo();
  const renderEngine = await rendererManager.getRenderer(rendererName);
  const renderContext = new RenderContext(renderEngine, templatePath, cacheTemplates);
  logger.debug('Renderer info registered.');

  fastify.decorateReply<IRenderFunction>('render', async (template, layout) => {
    fastify.addHook('onSend', async (req, res, payload) => {
      const timer = new Timer();
      timer.start();
      const html = await renderContext.render(template, layout, payload);
      res.type('text/html');
      timer.end();
      logger.debug(`Rendered template: ${template} (${timer.result()}ms)`);
      return html;
    });
  });
};

export default fastifyPlugin(plugin, { name: 'BlogNodeRender' });
