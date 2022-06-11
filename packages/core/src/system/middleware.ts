/* eslint-disable max-classes-per-file */
import { Timer } from '@src/util/utils';
import Application from 'koa';
import Router from 'koa-router';

import { BlogNodeFatalError } from './error';
import logging from './logging';

const logger = logging.getLogger('Middleware');

export type KoaMiddleware = Application.Middleware<unknown, unknown, unknown>;

export abstract class BlogNodeMiddleware {
  public getName(): string {
    return this.constructor.name;
  }
}

export abstract class SystemMiddleware extends BlogNodeMiddleware {
  onRegisterEvents(): void | Promise<void> {}

  abstract onInit(): void | Promise<void>;

  onServerStarted(): void | Promise<void> {}
}

export abstract class ServerMiddleware extends BlogNodeMiddleware {
  private router?: Router;

  abstract getKoaMiddleware(): KoaMiddleware | null | Promise<KoaMiddleware | null>;

  beforeSetting(): void | Promise<void> {}

  afterSetting(): void | Promise<void> {}

  setRouter(router: Router): void {
    this.router = router;
  }

  protected getKoaRouter(): Router {
    if (!this.router) throw new BlogNodeFatalError('Router is undefined.');
    return this.router;
  }
}

async function registerServer(koaApp: Application, koaRouter: Router, middlewares: ServerMiddleware[]): Promise<void> {
  const timer = new Timer();
  // eslint-disable-next-line no-restricted-syntax
  for await (const middleware of middlewares) {
    const name = middleware.getName();
    const time = await timer.decorate(async () => {
      await middleware.beforeSetting();
      middleware.setRouter(koaRouter);
      const koaMiddleware = await middleware.getKoaMiddleware();
      if (koaMiddleware) koaApp.use(koaMiddleware);
      await middleware.afterSetting();
    });
    logger.debug(`Loaded server middleware: ${name} (${time}ms)`);
  }
}

async function loadSystemMiddlewares(middlewares: SystemMiddleware[]): Promise<void> {
  const timer = new Timer();
  // eslint-disable-next-line no-restricted-syntax
  for await (const middleware of middlewares) {
    const name = middleware.getName();
    logger.debug(`Loading system middleware: ${name}...`);
    const time = await timer.decorate(async () => {
      await middleware.onRegisterEvents();
      await middleware.onInit();
      await middleware.onServerStarted();
    });
    logger.debug(`Loaded system middleware: ${name} (${time}ms)`);
  }
}

export default {
  registerServer,
  loadSystemMiddlewares,
};
