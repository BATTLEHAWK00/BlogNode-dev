import { User } from '@src/interface/entities/user';
import { Schema } from 'mongoose';

export default new Schema<User>({
  userId: {
    type: Number, required: true, index: true, unique: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 64,
    index: true,
    unique: true,
  },
  nickname: {
    type: String, minlength: 4, maxlength: 64, index: true,
  },
  gender: { type: String, enum: ['male', 'female'] },
  bio: { type: String, maxlength: 256 },
  email: {
    type: String, maxlength: 64, lowercase: true, index: true, unique: true,
  },
  phone: {
    type: String, maxlength: 32, index: true, unique: true,
  },
  website: { type: String, maxlength: 64 },
  avatar: { type: String, maxlength: 256 },
  passwordHash: { type: String, required: true, index: true },
  passwordSalt: { type: String, required: true },
  registerTime: { type: Date, required: true },
  role: { type: String, required: true },
  lastLogin: { type: Date },
  registerIp: { type: String, required: true, maxlength: 64 },
  loginIp: { type: String, maxlength: 64 },
});
