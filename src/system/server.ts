import Koa from 'koa';
import Compress from 'koa-compress';
import KoaLogger from 'koa-logger';
import KoaRouter from 'koa-router';
import bus from './bus';
import { EventType } from './events';
import logging from './logging';
import processEvent from './processEvent';
import nextConfig from './middlewares/nextConfig';
import config from '../config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDev = process.env.NODE_ENV === 'development';
const koaServer = new Koa();
const logger = logging.getLogger('server');

logger.info('Server starting...');

koaServer.use(Compress());
koaServer.use(KoaLogger((str) => logger.debug(str)));

const router = new KoaRouter();

function handleFatalError(err: Error) {
  logger.fatal('Fatal Error!');
  logger.fatal(err);
}

function handleServerListening() {
  logger.info(
    `Server Listening on ${config.httpConfig.address}:${config.httpConfig.port}`,
  );
  bus.once(EventType.SystemStarted, () => {});
  bus.broadcast(EventType.SystemStarted);
}

nextConfig.prepare(koaServer, router, () => {
  koaServer.use(router.routes());

  processEvent.handlePromiseRejection();
  processEvent.handleProcessExit();

  koaServer
    .listen(config.httpConfig.port, config.httpConfig.address)
    .on('listening', handleServerListening)
    .on('error', handleFatalError);
});
