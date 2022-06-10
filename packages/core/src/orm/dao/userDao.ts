import { User } from '@src/interface/entities/user';
import cache from '@src/system/cache';
import { BlogNodeError } from '@src/system/error';
import logging from '@src/system/logging';
import mongoose from 'mongoose';

import userSchema from '../schema/userSchema';
import BaseDao from './baseDao';

function getCacheKeyById(id:number) {
  return `id:${id}`;
}

export default class UserDao extends BaseDao<User> {
  protected setLoggerName(): string {
    return 'UserDao';
  }

  protected setCache() {
    return cache.getCache<User>(500);
  }

  protected setModel(): mongoose.Model<User, {}, {}, {}> {
    return mongoose.model('user', userSchema);
  }

  async getAllUsers(): Promise<User[]> {
    return this.model.find()
      .sort({ _id: 1 })
      .exec();
  }

  async getUserByIds(ids: number[]): Promise<User[]> {
    const op = this.cached()
      .multiple
      .ifUncached(
        async (keys) => this.model.find({ _id: keys }),
        (user) => getCacheKeyById(user._id),
      );
    return op.get(ids.map(getCacheKeyById));
  }

  async getUserById(id: number): Promise<User | null> {
    const op = this.cached()
      .single
      .ifUncached(async () => this.model.findOne({ _id: id }));
    return op.get(getCacheKeyById(id));
  }

  async getEstimatedUserCount() {
    return this.model.estimatedDocumentCount();
  }

  async getUserCount() {
    return this.model.countDocuments();
  }

  async getIncrementId() {
    const lastUser = await this.model.findOne({}, { _id: 1 }).sort({ _id: -1 });
    if (!lastUser) throw new BlogNodeError("Last user doesn't exists.");
    return lastUser._id + 1;
  }

  async createUser(user:Partial<User>) {
    const session = await this.model.startSession();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _id = await this.getIncrementId();
    await this.model.create({ ...user, _id });
    await session.endSession();
  }

  protected async onDatabaseConnected() {
    const user:Partial<User> = {
      _id: 1,
      username: 'admin',
      passwordHash: '',
      passwordSalt: '',
      passwordHashType: 'none',
      registerTime: new Date(),
      registerIp: '127.0.0.1',
      role: 'admin',
    };
    const adminUser:User | null = await this.model.findOne({ _id: 1 });
    if (adminUser) return;
    await this.model.create(user);
    logging.systemLogger.info('Created default admin user.');
  }
}

export const userDao = new UserDao();
