import bus from '@src/system/bus';
import config from '@src/system/config';
import { EventType } from '@src/system/events';
import logging from '@src/system/logging';
import middleware, { SystemMiddleware } from '@src/system/middleware';
import Koa from 'koa';
import KoaRouter from 'koa-router';

import middlewares from '../serverMiddlewares';

const logger = logging.systemLogger;

const koaServer = new Koa();
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

class KoaMiddleware extends SystemMiddleware {
  private server:any;

  async onInit(): Promise<void> {
    logger.info('Starting server...');
    await middleware.registerServer(koaServer, router, middlewares);
    this.server = koaServer
      .listen(config.httpConfig.port, config.httpConfig.address)
      .on('listening', handleServerListening)
      .on('error', handleFatalError);
    koaServer.use(router.routes());
  }

  async onRegisterEvents(): Promise<void> {
    bus.once(EventType.SYS_BeforeSystemStop, () => {
      logger.debug('Closing server...');
      return new Promise((resolve, reject) => {
        this.server.close((err:Error) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }
}

export default new KoaMiddleware();
