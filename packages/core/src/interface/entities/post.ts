import { Entity } from '../interface';
import { Comment } from './comment';

export interface Post extends Entity{
  postId:number,
  content:string,
  comments:Comment[],
  postedBy:number,
  postedAt:Date,
  lastModified:Date
}
