import { User } from '@src/interface/entities/user';
import { createSharedCache } from '@src/system/cache';
import { BlogNodeError } from '@src/system/error';
import logging from '@src/system/logging';
import { cacheKey } from '@src/util/system-utils';
import mongoose from 'mongoose';

import userSchema from '../schema/user';
import BaseDao from './baseDao';

const getCacheKeyById = cacheKey('id');
const getCacheKeyByUname = cacheKey('uname');

export default class UserDao extends BaseDao<User> {
  private cache = createSharedCache<User>('entity:user');

  protected setLoggerName(): string {
    return 'UserDao';
  }

  protected setModel(): mongoose.Model<User> {
    return mongoose.model('user', userSchema);
  }

  async getAllUsers(): Promise<User[]> {
    return this.model.find()
      .sort({ _id: 1 })
      .exec();
  }

  // async getUserByIds(ids: number[]): Promise<User[]> {
  //   const op = this.cached()
  //     .multiple
  //     .ifUncached(
  //       async (keys) => this.model.find({ _id: keys }),
  //       (user) => getCacheKeyById(user._id),
  //     );
  //   return op.get(ids.map(getCacheKeyById));
  // }

  async getUserById(id: number): Promise<User | null> {
    const idStr = id.toString();
    if (await this.cache.has(idStr)) return (await this.cache.get(idStr)) || null;
    const res = await this.model.findOne({ _id: id });
    await this.cache.set(idStr, res);
    return res;
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
    if (await this.cache.has(username)) return this.cache.get(username);
    const res = await this.model.findOne({ username });
    await this.cache.set(username, res);
    return res;
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
