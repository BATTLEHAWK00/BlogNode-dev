import { Comment } from '@src/interface/entities/comment';
import { Schema, Types } from 'mongoose';

export default new Schema<Comment>({
  content: { type: String, required: true, default: '' },
  commentBy: { type: Number, required: true, index: true },
  commentAt: { type: Date, required: true, index: true },
  replyTo: { type: Types.ObjectId, index: true },
  lastModified: { type: Date },
  senderIp: { type: String, required: true, default: '' },
  senderUa: { type: String, required: true, default: '' },
});
