import type PostDao from '@src/orm/dao/postDao';
import type SystemDao from '@src/orm/dao/systemDao';
import type UserDao from '@src/orm/dao/userDao';

export interface BlogNodeDao{
  postDao: PostDao
  systemDao: SystemDao
  userDao: UserDao
}
