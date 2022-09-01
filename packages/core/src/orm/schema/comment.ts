import { Comment } from '@src/interface/entities/comment';
import mongoose from 'mongoose';

export default new mongoose.Schema<Comment>({
  content: { type: String, required: true, default: '' },
  commentBy: { type: Number, required: true, index: true },
  commentAt: { type: Date, required: true, index: true },
  replyTo: { type: mongoose.Types.ObjectId, index: true },
  lastModified: { type: Date },
  senderIp: { type: String, required: true, default: '' },
  senderUa: { type: String, required: true, default: '' },
});
