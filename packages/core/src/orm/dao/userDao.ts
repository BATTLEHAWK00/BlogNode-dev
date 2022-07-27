import { User } from '@src/interface/entities/user';
import cache from '@src/system/cache';
import { BlogNodeError } from '@src/system/error';
import logging from '@src/system/logging';
import { cacheKey } from '@src/util/utils';
import LRUCache from 'lru-cache';
import mongoose from 'mongoose';

import userSchema from '../schema/userSchema';
import BaseDao from './baseDao';

const getCacheKeyById = cacheKey('id');
const getCacheKeyByUname = cacheKey('uname');

export default class UserDao extends BaseDao<User> {
  protected setLoggerName(): string {
    return 'UserDao';
  }

  protected setCache(): LRUCache<string, User> {
    return cache.getCache<User>(500);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
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

  async getEstimatedUserCount(): Promise<number> {
    return this.model.estimatedDocumentCount();
  }

  async getUserCount(): Promise<number> {
    return this.model.countDocuments();
  }

  async getIncrementId(): Promise<number> {
    const lastUser = await this.model.findOne({}, { _id: 1 }).sort({ _id: -1 });
    if (!lastUser) throw new BlogNodeError("Last user doesn't exists.");
    return lastUser._id + 1;
  }

  async getUserByUname(username: string): Promise<User | null> {
    const op = this.cached().single.ifUncached(async () => this.model.findOne({ username }));
    return op.get(getCacheKeyByUname(username));
  }

  async createUser(user: Partial<User>): Promise<number> {
    const session = await this.model.startSession();
    session.startTransaction();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _id = await this.getIncrementId();
    await this.model.create({ ...user, _id });
    await session.commitTransaction();
    await session.endSession();
    return _id;
  }

  protected async onDatabaseConnected(): Promise<void> {
    const user: Partial<User> = {
      _id: 1,
      username: 'admin',
      passwordHash: '',
      passwordSalt: '',
      passwordHashType: 'none',
      registerTime: new Date(),
      registerIp: '127.0.0.1',
      role: 'admin',
    };
    const adminUser: User | null = await this.model.findOne({ _id: 1 });
    if (adminUser) return;
    await this.model.create(user);
    logging.systemLogger.info('Created default admin user.');
  }
}

export const userDao = new UserDao();
__blognode.dao.userDao = userDao;
