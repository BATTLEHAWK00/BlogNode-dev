import { Entity } from '../interface';

export type Gender = 'male' | 'female' | 'unknown';

export interface User extends Entity {
  userId: number;
  username: string;
  nickname: string;
  gender: Gender;
  bio: string;
  email: string;
  phone: string;
  website: string;
  avatar: string;
  passwordHash: string;
  passwordSalt: string;
  registerTime: Date;
  lastLogin: Date;
  registerIp: string;
  loginIp: string;
}
