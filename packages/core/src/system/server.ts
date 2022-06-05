import { Timer } from '@src/util/utils';
import Koa from 'koa';
import Compress from 'koa-compress';
import KoaLogger from 'koa-logger';
import KoaRouter from 'koa-router';

import config from '../config';
import bus from './bus';
import { EventType } from './events';
import logging from './logging';
import nextConfig from './middlewares/nextConfig';
import processEvent from './processEvent';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDev = process.env.NODE_ENV === 'development';
const koaServer = new Koa();
const logger = logging.systemLogger;

logger.info('Starting server...');

koaServer.use(Compress());
koaServer.use(KoaLogger((str) => logger.debug(str)));

const router = new KoaRouter();

function handleFatalError(err: Error) {
  logger.fatal('Fatal Error!');
  logger.fatal(err);
}

function handleServerListening() {
  logger.info(
    `Server listening on http://${config.httpConfig.address}:${config.httpConfig.port}`,
  );
  bus.broadcast(EventType.SYS_SystemStarted);
}

const nextTimer = new Timer();
nextTimer.start();
setTimeout(() => {
  if (!nextTimer.isStopped()) {
    const errMsg = 'SSR Engine start timed out!';
    logger.fatal(errMsg);
    throw new Error(errMsg);
  }
}, 20000);

nextConfig.prepare(koaServer, router).then(() => {
  nextTimer.end();

  koaServer.use(router.routes());

  processEvent.handlePromiseRejection();
  processEvent.handleProcessExit();

  const server = koaServer
    .listen(config.httpConfig.port, config.httpConfig.address)
    .on('listening', handleServerListening)
    .on('error', handleFatalError);

  bus.once(EventType.SYS_BeforeSystemStop, () => {
    logger.debug('Closing server...');
    server.close();
  });
});
