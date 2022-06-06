import Koa from 'koa';
import KoaRouter from 'koa-router';

import config from '../config';
import bus from './bus';
import { EventType } from './events';
import logging from './logging';
import middleware from './middleware';
import middlewares from './middlewares';

const logger = logging.systemLogger;

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

(async () => {
  logger.info('Starting server...');

  const koaServer = new Koa();
  const router = new KoaRouter();

  await middleware.register(koaServer, router, middlewares);

  koaServer.use(router.routes());

  const server = koaServer
    .listen(config.httpConfig.port, config.httpConfig.address)
    .on('listening', handleServerListening)
    .on('error', handleFatalError);

  bus.once(EventType.SYS_BeforeSystemStop, () => {
    logger.debug('Closing server...');
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
})();
