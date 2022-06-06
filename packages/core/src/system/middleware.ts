import { Timer } from '@src/util/utils';
import Application from 'koa';
import Router from 'koa-router';

import logging from './logging';

const logger = logging.getLogger('Middleware');

export type KoaMiddleware = Application.Middleware<any, any, any>;

export abstract class ServerMiddleware {
  private router?:Router;

  private name:string;

  abstract getKoaMiddleware():KoaMiddleware | Promise<KoaMiddleware>;

  protected abstract setName():string;

  public getName() {
    return this.name;
  }

  setRouter(router:Router) {
    this.router = router;
  }

  beforeSetting():void | Promise<void> {}

  afterSetting():void | Promise<void> {}

  protected getKoaRouter():Router {
    if (!this.router) throw new Error('Router is undefined.');
    return this.router;
  }

  constructor() {
    this.name = this.setName();
  }
}

async function register(koaApp:Application, koaRouter:Router, middlewares:ServerMiddleware[]) {
  const timer = new Timer();
  // eslint-disable-next-line no-restricted-syntax
  for await (const middleware of middlewares) {
    const name = middleware.getName();
    logger.trace(`Loading middleware: ${name}...`);
    const time = await timer.decorate(async () => {
      middleware.setRouter(koaRouter);
      await middleware.beforeSetting();
      koaApp.use(await middleware.getKoaMiddleware());
      await middleware.afterSetting();
    });
    logger.debug(`Loaded middleware: ${name} (${time}ms)`);
  }
}

export default {
  register,
};
