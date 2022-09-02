import fastifyStatic from '@fastify/static';
import { fromDist, fromSrc } from '@src/util/paths';
import { FastifyPluginCallback, FastifyReply } from 'fastify';
import fastifyplugin from 'fastify-plugin';
import LRUCache from 'lru-cache';
import ejs, { AsyncTemplateFunction, Data } from 'ejs';
import path from 'path';
import fs from 'fs/promises';
import internalRoutes from '@src/pages/internalRoutes';
import logging from '../../logging';

type IInternalRenderFunc = (template: string, payload?: unknown)=> Promise<void>;

declare module 'fastify'{
  interface FastifyReply{
    internalRender: IInternalRenderFunc
  }
}

const staticDir = fromDist('static');
const templateDir = fromSrc('pages/templates');
const templateCache: LRUCache<string, AsyncTemplateFunction> = new LRUCache({ max: 10 });

async function fetchTemplate(template: string): Promise<AsyncTemplateFunction> {
  const renderFunc = templateCache.get(template);
  if (renderFunc) return renderFunc;
  const file = await fs.readFile(path.resolve(templateDir, template), { encoding: 'utf-8' });
  const func = ejs.compile(file, { async: true });
  templateCache.set(template, func);
  return func;
}

const plugin: FastifyPluginCallback = async (app) => {
  async function renderFunc(this: FastifyReply, templateName: string, payload: unknown) {
    try {
      const renderTemplate = await fetchTemplate(templateName);
      const html = await renderTemplate(payload as Data);
      this.type('text/html');
      this.send(html);
    } catch (e) {
      this.status(500);
      throw e;
    }
  }
  app.decorateReply('internalRender', renderFunc);
  await app.register(internalRoutes);
  await app.register(fastifyStatic, {
    root: staticDir,
    index: false,
    prefix: '/bn-static',
    decorateReply: false,
  });
  app.setNotFoundHandler(async (req, res) => {
    res.status(404);
    return res.internalRender('404.ejs');
  });
  logging.systemLogger.debug('Registered internal routes.');
};

export default fastifyplugin(plugin, { name: 'InternalRoutes' });
