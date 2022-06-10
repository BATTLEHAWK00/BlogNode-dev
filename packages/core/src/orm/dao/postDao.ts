import { Post } from '@src/interface/entities/post';
import cache from '@src/system/cache';
import mongoose, { Model } from 'mongoose';

import postSchema from '../schema/postSchema';
import BaseDao from './baseDao';

function getKeyById(id:number) {
  return `id:${id}`;
}

export default class PostDao extends BaseDao<Post> {
  protected setLoggerName(): string {
    return 'PostDao';
  }

  protected setModel(): Model<Post, {}, {}, {}> {
    return mongoose.model('post', postSchema);
  }

  protected setCache() {
    return cache.getCache<Post>(400);
  }

  async findPostById(id:number) {
    return this.cached().single
      .ifUncached(async () => this.model.findById(id))
      .get(getKeyById(id));
  }

  async getEstimatedPostCounts() {
    return this.model.estimatedDocumentCount();
  }
}

export const postDao = new PostDao();
