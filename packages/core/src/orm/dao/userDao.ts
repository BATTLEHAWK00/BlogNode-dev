import { User } from '@src/interface/entities/user';
import mongoose from 'mongoose';
import cache, { CacheOperation, cacheOperation } from '@system/cache';
import userSchema from '../schema/userSchema';
import BaseDao from './baseDao';

function getCacheKeyById(id:number) {
  return `id:${id}`;
}

class UserDao extends BaseDao<User> {
  protected setLoggerName(): string {
    return 'UserDao';
  }

  protected setCacheOperation(): CacheOperation<User> {
    return cacheOperation(cache.getCache<User>(500));
  }

  protected setModel(): mongoose.Model<User, {}, {}, {}> {
    return mongoose.model('user', userSchema);
  }

  async getAllUsers(): Promise<User[]> {
    return this.getModel().find()
      .sort({ userId: 1 })
      .exec();
  }

  async getUserByIds(ids: number[]): Promise<User[]> {
    const op = this.getCache()
      .multiple
      .ifUncached(
        async (keys) => this.getModel().find({ userId: keys }),
        (user) => getCacheKeyById(user.userId),
      );
    return op.get(ids.map(getCacheKeyById));
  }

  async getUserById(id: number): Promise<User | null> {
    const op = this.getCache()
      .single
      .ifUncached(async (key) => this.getModel().findOne({ userId: key }));
    return op.get(getCacheKeyById(id));
  }

  async getEstimatedUserCount() {
    return this.getModel().estimatedDocumentCount();
  }

  async getUserCount() {
    return this.getModel().countDocuments();
  }
}

export default new UserDao();
