import { Entity } from '../interface';
import { Comment } from './comment';

export type PostStatus = 'publish' | 'hidden';
export type PostType = 'post' | 'page';
export interface Post extends Entity{
  _id:number,
  pathName:string,
  title:string,
  type:PostType,
  content:string,
  status:PostStatus,
  allowComment:boolean,
  comments:Comment[],
  postedBy:number,
  postedAt:Date,
  lastModified:Date
}
