import bus from '@src/system/bus';
import { CacheOperation, cacheOperation } from '@src/system/cache';
import database from '@src/system/database';
import { EventType } from '@src/system/events';
import logging from '@src/system/logging';
import { Logger } from 'log4js';
import Cache from 'lru-cache';
import { Model } from 'mongoose';

export default abstract class BaseDao<T> {
  static databaseConnectedEvents:(()=>void | Promise<void>)[] = [];

  private readonly cacheOp:CacheOperation<T>;

  protected readonly model:Model<T>;

  protected readonly cache:Cache<string, T>;

  protected readonly logger:Logger;

  protected abstract setModel():Model<T>;

  protected abstract setCache():Cache<string, T>;

  protected abstract setLoggerName():string;

  protected cached() {
    return this.cacheOp;
  }

  protected onDatabaseConnected():Promise<void> | void {}

  constructor() {
    this.model = this.setModel();
    this.cache = this.setCache();
    this.cacheOp = cacheOperation(this.cache);
    this.logger = logging.getLogger(this.setLoggerName());
    database.registerModel(this.model);
    BaseDao.databaseConnectedEvents.push(() => this.onDatabaseConnected());
  }
}

bus.once(
  EventType.SYS_DatabaseConnected,
  async () => Promise.all(BaseDao.databaseConnectedEvents.map((cb) => cb())),
);
