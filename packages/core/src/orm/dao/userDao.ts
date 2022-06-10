import { User } from '@src/interface/entities/user';
import cache from '@src/system/cache';
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
      .sort({ userId: 1 })
      .exec();
  }

  async getUserByIds(ids: number[]): Promise<User[]> {
    const op = this.cached()
      .multiple
      .ifUncached(
        async (keys) => this.model.find({ userId: keys }),
        (user) => getCacheKeyById(user.userId),
      );
    return op.get(ids.map(getCacheKeyById));
  }

  async getUserById(id: number): Promise<User | null> {
    const op = this.cached()
      .single
      .ifUncached(async () => this.model.findOne({ userId: id }));
    return op.get(getCacheKeyById(id));
  }

  async getEstimatedUserCount() {
    return this.model.estimatedDocumentCount();
  }

  async getUserCount() {
    return this.model.countDocuments();
  }
}

export const userDao = new UserDao();
