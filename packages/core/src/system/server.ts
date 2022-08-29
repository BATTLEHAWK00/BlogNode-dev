import Fastify, { FastifyInstance } from 'fastify';
import fastifyCaching from '@fastify/caching';
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
// import { fastifyStatic } from '@fastify/static';
import { BlogNodeFatalError } from './error';
import logging from './logging';
import routerRegistry from './routerRegistry';
import loggingPlugin from './fastifyPlugins/loggingPlugin';
import renderPlugin from './fastifyPlugins/renderPlugin';
import theme, { IBlogNodeRenderer } from './manager/theme';

const logger = logging.getLogger('Http');

const initializedFastify: FastifyInstance = Fastify();

let fastify: FastifyInstance = initializedFastify;

function registerCorePlugins() {
  fastify.register(fastifyCompress);
  fastify.register(fastifyCaching);
  fastify.register(fastifyCookie, {
    secret: 'test',
  });
  //   fastify.register(fastifyStatic);
  fastify.register(fastifyRateLimit, {
    max: 10,
  });
}

function registerBlogNodePlugins() {
  fastify.register(loggingPlugin, { logger });
  fastify.register(renderPlugin, {
    renderEngine: theme.getThemeInfo()?.renderEngine as IBlogNodeRenderer,
    templatePath: __dirname,
    cacheTemplates: true,
  });
}

function init(): void {
  registerCorePlugins();
  registerBlogNodePlugins();
}

async function reset(): Promise<void> {
  await fastify.close();
  fastify = { ...initializedFastify };
}

type IRouteRegistry = Pick<FastifyInstance, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'all' | 'route'>;
type IRegisterRoutesCallback = (routeRegistry: IRouteRegistry)=> Promise<void>;
async function registerRoutes(cb: IRegisterRoutesCallback) {
  await cb(fastify);
}

async function listen(port = 3000, host = '0.0.0.0'): Promise<void> {
  try {
    await fastify.listen({ port, host });
    logger.info(`Server listening on http://${host}:${port}`);
  } catch (e) {
    throw new BlogNodeFatalError('Error occurred when server start listening.', { cause: e as Error });
  }
}

function close(): Promise<void> {
  return fastify.close();
}

export default {
  init,
  listen,
  close,
  reset,
};
