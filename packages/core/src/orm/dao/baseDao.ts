import { Entity } from '@src/interface/entities/base';
import bus from '@src/system/bus';
import database from '@src/system/database';
import logging from '@src/system/logging';
import { Awaitable } from '@src/util/types';
import { RESOLVER } from 'awilix';
import { Logger } from 'log4js';
import { Model } from 'mongoose';

export default abstract class BaseDao<T extends Entity> {
  static databaseConnectedEvents: (()=> Awaitable<void>)[] = [];

  public readonly model: Model<T>;

  protected readonly logger: Logger;

  protected abstract setModel(): Model<T>;

  protected abstract setLoggerName(): string;

  protected onDatabaseConnected(): Awaited<void> {}

  constructor() {
    this.model = this.setModel();
    this.logger = logging.getLogger(this.setLoggerName());
    database.registerModel(this.model);
    BaseDao.databaseConnectedEvents.push(() => this.onDatabaseConnected());
  }
}

bus.once(
  'database/connected',
  async () => Promise.all(BaseDao.databaseConnectedEvents.map((cb) => cb())),
);
