import { Post } from '@src/interface/entities/post';
import cache, { cacheOperation, CacheOperation } from '@src/system/cache';
import mongoose, { Model } from 'mongoose';
import postSchema from '../schema/postSchema';
import BaseDao from './baseDao';

class PostDao extends BaseDao<Post> {
  protected setLoggerName(): string {
    return 'PostDao';
  }

  protected setModel(): Model<Post, {}, {}, {}> {
    return mongoose.model('post', postSchema);
  }

  protected setCacheOperation(): CacheOperation<Post> {
    return cacheOperation(cache.getCache(100));
  }
}

export default new PostDao();
