import { Post } from '@src/interface/entities/post';
import { Schema } from 'mongoose';
import commentSchema from './commentSchema';

export default new Schema<Post>({
  postId: {
    type: Number, required: true, min: 1, index: true, unique: true,
  },
  content: { type: String, required: true, default: '' },
  comments: {
    type: [commentSchema],
    default: [],
  },
  postedAt: { type: Date, required: true, index: true },
  postedBy: { type: Number, required: true, index: true },
  lastModified: { type: Date },
});
