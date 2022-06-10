import { Entity } from '../interface';

export type Gender = 'male' | 'female' | 'unknown';

export type Role = 'admin' | 'subscriber';
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
  passwordHashType: string;
  role:Role;
  registerTime: Date;
  lastLogin: Date;
  registerIp: string;
  loginIp: string;
}
