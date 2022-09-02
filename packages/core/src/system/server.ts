import Fastify, { FastifyInstance, FastifyServerFactory } from 'fastify';
import fastifyCaching from '@fastify/caching';
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyHelmet from '@fastify/helmet';
import fastifyUrlData from '@fastify/url-data';
// import fastifyAutoLoad from '@fastify/autoload';
// import { fastifyStatic } from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import { AddressInfo, ListenOptions } from 'net';
import http from 'http';
import { Timer } from '@src/util/system-utils';
import { BlogNodeFatalError } from './error';
import logging from './logging';
import loggingPlugin from './fastifyPlugins/loggingPlugin';
import internalRoutesPlugin from './fastifyPlugins/autoload/internalRoutesPlugin';
import renderPlugin from './fastifyPlugins/renderPlugin';

const logger = logging.getLogger('Server');

const serverFactory: FastifyServerFactory = (handler) => {
  const server = http.createServer((req, res) => {
    handler(req, res);
  });
  return server;
};

let fastify: FastifyInstance = Fastify({ serverFactory });

async function registerCorePlugins() {
  return Promise.all([
    fastify.register(fastifyCompress, {
      threshold: 1024,
    }),
    fastify.register(fastifyCaching),
    fastify.register(fastifyCookie, {
      secret: 'test',
    }),
    fastify.register(fastifyHelmet),
    fastify.register(fastifyMultipart),
    fastify.register(fastifyUrlData),
    fastify.register(fastifyRateLimit, {
      max: 60,
      timeWindow: 60 * 1000,
      onExceeded(req) {
        logger.warn(`Reaching request rate limit, ip: ${req.ip} url: ${req.method} ${req.url}`);
      },
    }),
    // fastify.register(fastifyStatic);
  ]);
}

async function registerBlogNodePlugins() {
  return Promise.all([
    fastify.register(loggingPlugin, { logger }),
    fastify.register(renderPlugin, { cacheTemplates: true }),
    fastify.register(internalRoutesPlugin),
    // fastify.register(fastifyAutoLoad, {
    //   dir: fromSrc('system/fastifyPlugins/autoload'),
    // }),
  ]);
}

async function init(): Promise<void> {
  await registerCorePlugins();
  fastify.setErrorHandler((error) => {
    logger.error('Error occurred on http server:');
    logger.error(error);
  });
  await registerBlogNodePlugins();
  logger.trace(fastify.printPlugins());
}

async function listen(port = 3000, host = '0.0.0.0', isReload = false): Promise<void> {
  try {
    const url = await fastify.listen({ port, host });
    if (!isReload) logger.info(`Server listening on ${url}`);
  } catch (e) {
    throw new BlogNodeFatalError('Error occurred when server start listening.', { cause: e as Error });
  }
}

async function reload(): Promise<void> {
  const { port, address } = fastify.server.address() as AddressInfo;
  const timer = new Timer();
  timer.start();
  logger.info('Reloading server...');
  await fastify.close();
  fastify = Fastify();
  await init();
  await listen(port, address, true);
  timer.end();
  logger.info(`Reload complete. (${timer.result()}ms)`);
}

function close(): Promise<void> {
  return fastify.close();
}

export default {
  init,
  listen,
  close,
  reload,
};
