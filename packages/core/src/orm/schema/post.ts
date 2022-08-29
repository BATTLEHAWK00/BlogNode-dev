import { Post } from '@src/interface/entities/post';
import { Schema } from 'mongoose';

import commentSchema from './comment';

export default new Schema<Post>({
  _id: {
    type: Number, required: true, min: 1, auto: true,
  },
  content: { type: String, required: true, default: '' },
  allowComment: { type: Boolean, required: true, default: true },
  status: { type: String, required: true },
  pathName: { type: String },
  type: { type: String, required: true },
  comments: {
    type: [commentSchema],
    default: [],
  },
  postedAt: { type: Date, required: true, index: true },
  author: { type: Number, required: true, index: true },
  lastModified: { type: Date },
});
