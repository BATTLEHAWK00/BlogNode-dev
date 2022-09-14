import { Post } from '@src/interface/entities/post';
import mongoose, { Model } from 'mongoose';

import postSchema from '../schema/post';
import BaseDao from './baseDao';

export default class PostDao extends BaseDao<Post> {
  protected setLoggerName(): string {
    return 'PostDao';
  }

  protected setModel(): Model<Post> {
    return mongoose.model('post', postSchema);
  }

  async findPostById(id: number): Promise<Post | null> {
    return null;
  }

  async getEstimatedPostCounts(): Promise<number> {
    return this.model.estimatedDocumentCount();
  }
}

export const postDao = new PostDao();
