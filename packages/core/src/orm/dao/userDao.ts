import { User } from '@src/interface/entities/user';
import mongoose, { Model } from 'mongoose';
import cache from '@system/cache';
import bus from '@src/system/bus';
import { EventType } from '@src/system/events';
import database from '@src/system/database';
import { userSchema } from '../schema/user';

const userCache = cache.getCache<User>(500);

const userModel:Model<User> = mongoose.model('user', userSchema);

async function getAllUsers(): Promise<User[]> {
  const res:User[] = await userModel.find()
    .sort({ userId: 1 })
    .limit(1000)
    .exec();
  res.forEach((user) => userCache.set(`id:${user.userId}`, user));
  return res;
}

async function getUserById(ids: number[]): Promise<User[]> {
  const fetchIds = ids.filter((id) => userCache.has(`id:${id}`));
  const res:User[] = await userModel.find({ userId: fetchIds });
  res.forEach((user) => userCache.set(`id:${user.userId}`, user));
  return res;
}

async function getEstimatedUserCount() {
  return userModel.estimatedDocumentCount();
}

database.registerModel(userModel);

export default {
  getEstimatedUserCount,
  getAllUsers,
  getUserById,
};
