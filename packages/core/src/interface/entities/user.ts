import { Entity } from '../interface';

export type Gender = 'male' | 'female' | 'unknown';

export type Role = 'admin' | 'subscriber';

export type PasswordHashType = 'sha256' | 'sha512' | 'none';

export interface User extends Entity {
  _id: number;
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
  passwordHashType: PasswordHashType;
  role: Role;
  registerTime: Date;
  lastLogin: Date;
  registerIp: string;
  loginIp: string;
}
