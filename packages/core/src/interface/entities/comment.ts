import { ObjectId } from 'mongoose';
import { Entity } from '../interface';

export interface Comment extends Entity{
  content: string,
  commentBy: number,
  commentAt: Date,
  lastModified: Date,
  replyTo: ObjectId,
  senderIp: string,
  senderUa: string
}
