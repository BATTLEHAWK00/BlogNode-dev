import { BlogNodeRequestError } from '@src/system/error';
import { sha256WithSalt } from '@src/system/security/crypto';
import jwt, { BlogNodeJwtPayload } from '@src/system/security/jwt';
import moment = require('moment');
import bus from '@src/system/bus';
import { User } from '@src/interface/interface';
import { userDao } from '../dao/userDao';
import BaseService from './baseService';
import { systemService } from './systemService';

interface AuthJwtPayload extends BlogNodeJwtPayload{
  due: Date
  uid: number
}

class AuthService extends BaseService<AuthService> {
  async login(username: string, passwdHash: string): Promise<unknown> {
    const user = await userDao.getUserByUname(username);
    if (!user) throw new BlogNodeRequestError(`User ${username} not exists.`);
    const hashedResult = sha256WithSalt(passwdHash, user.passwordSalt);
    if (hashedResult === user.passwordHash) {
      const payload: AuthJwtPayload = {
        due: moment().add('1', 'minute').toDate(),
        uid: user._id,
      };
      await bus.broadcast('auth/login', user);
      return jwt.sign(payload, await systemService.get('jwt-secret') || 'secret');
    } throw new BlogNodeRequestError('Password not correct.');
  }

  async register(user: Omit<User, '_id' | 'nickname'>): Promise<void> {
    const uid = await userDao.createUser(user);
    await bus.broadcast('auth/register', uid);
  }
}

export default new AuthService();
