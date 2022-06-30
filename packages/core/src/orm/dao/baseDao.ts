import { Entity } from '@src/interface/entities/base';
import bus from '@src/system/bus';
import { CacheOperation, cacheOperation } from '@src/system/cache';
import database from '@src/system/database';
import logging from '@src/system/logging';
import { Awaitable } from '@src/util/types';
import { Logger } from 'log4js';
import * as Cache from 'lru-cache';
import { Model } from 'mongoose';

export default abstract class BaseDao<T extends Entity> {
  static databaseConnectedEvents: (()=> Awaitable<void>)[] = [];

  private readonly cacheOp: CacheOperation<T>;

  public readonly model: Model<T>;

  protected readonly cache: Cache<string, T>;

  protected readonly logger: Logger;

  protected abstract setModel(): Model<T>;

  protected abstract setCache(): Cache<string, T>;

  protected abstract setLoggerName(): string;

  protected cached(): CacheOperation<T> {
    return this.cacheOp;
  }

  protected onDatabaseConnected(): Awaited<void> {}

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
  'database/connected',
  async () => Promise.all(BaseDao.databaseConnectedEvents.map((cb) => cb())),
);
