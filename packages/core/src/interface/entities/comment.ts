import { ObjectId } from 'mongoose';

import { Entity } from './base';

export interface Comment extends Entity{
  content: string,
  commentBy: number,
  commentAt: Date,
  lastModified: Date,
  replyTo: ObjectId,
  senderIp: string,
  senderUa: string
}
