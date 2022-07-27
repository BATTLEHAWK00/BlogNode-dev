import bus from '@src/system/bus';
import config from '@src/system/config';
import logging from '@src/system/logging';
import middleware, { SystemMiddleware } from '@src/system/middleware';
import { Server } from 'http';
import Koa from 'koa';
import KoaRouter from 'koa-router';

import middlewares from '../serverMiddlewares';

const logger = logging.systemLogger;

const koaServer = new Koa();
// eslint-disable-next-line new-cap
const router = new KoaRouter();

function handleFatalError(err: Error) {
  logger.fatal('Fatal Error!');
  logger.fatal(err);
}

function handleServerListening() {
  logger.info(
    `Server listening on http://${config.httpConfig.address}:${config.httpConfig.port}`,
  );
}

class KoaMiddleware extends SystemMiddleware {
  private server: Server | undefined;

  async onInit(): Promise<void> {
    logger.info('Starting server...');
    await middleware.registerServer(koaServer, router, middlewares);
    koaServer.use(router.routes());
    return new Promise((resolve) => {
      this.server = koaServer
        .listen(config.httpConfig.port, config.httpConfig.address)
        .on('listening', handleServerListening)
        .on('listening', () => resolve())
        .on('error', handleFatalError);
    });
  }

  async onRegisterEvents(): Promise<void> {
    bus.once('system/beforeStop', () => {
      logger.debug('Closing server...');
      return new Promise<void>((resolve, reject) => {
        this.server?.close((err?: Error) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }
}

export default new KoaMiddleware();
