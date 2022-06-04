import bus from '@src/system/bus';
import { CacheOperation } from '@src/system/cache';
import database from '@src/system/database';
import { EventType } from '@src/system/events';
import logging from '@src/system/logging';
import { Logger } from 'log4js';
import { Model } from 'mongoose';

export default abstract class BaseDao<T> {
  private model:Model<T>;

  private cacheOp:CacheOperation<T>;

  private logger:Logger;

  protected abstract setModel():Model<T>;

  protected abstract setCacheOperation():CacheOperation<T>;

  protected abstract setLoggerName():string;

  protected getCache() {
    return this.cacheOp;
  }

  protected getModel() {
    return this.model;
  }

  protected getLogger() {
    return this.logger;
  }

  protected onDatabaseConnected():Promise<void> | void {}

  constructor() {
    this.model = this.setModel();
    this.cacheOp = this.setCacheOperation();
    this.logger = logging.getLogger(this.setLoggerName());
    database.registerModel(this.model);
    bus.once(EventType.SYS_DatabaseConnected, () => this.onDatabaseConnected());
  }
}
