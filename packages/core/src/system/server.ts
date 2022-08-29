import Fastify, { FastifyInstance } from 'fastify';
import fastifyCaching from '@fastify/caching';
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyHelmet from '@fastify/helmet';
import fastifyUrlData from '@fastify/url-data';
// import { fastifyStatic } from '@fastify/static';
import { IBlogNodeRenderer } from '@blognode/types-renderer';
import fastifyMultipart from '@fastify/multipart';
import { AddressInfo } from 'net';
import { BlogNodeFatalError } from './error';
import logging from './logging';
import loggingPlugin from './fastifyPlugins/loggingPlugin';
import renderPlugin from './fastifyPlugins/renderPlugin';
import theme from './manager/theme';

const logger = logging.getLogger('Http');

let fastify: FastifyInstance = Fastify();

async function registerCorePlugins() {
  await Promise.all([
    fastify.register(fastifyCompress),
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
  await Promise.all([
    fastify.register(loggingPlugin, { logger }),
    fastify.register(renderPlugin, {
      cacheTemplates: true,
    }),
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

async function listen(port = 3000, host = '0.0.0.0'): Promise<void> {
  try {
    const url = await fastify.listen({ port, host });
    logger.info(`Server listening on ${url}`);
  } catch (e) {
    throw new BlogNodeFatalError('Error occurred when server start listening.', { cause: e as Error });
  }
}

async function restart(): Promise<void> {
  const { port, address } = fastify.server.address() as AddressInfo;
  logger.info('Restarting the server...');
  await fastify.close();
  fastify = Fastify();
  await init();
  await listen(port, address);
  logger.info('Restarting complete.');
}

function close(): Promise<void> {
  return fastify.close();
}

export default {
  init,
  listen,
  close,
  restart,
};
