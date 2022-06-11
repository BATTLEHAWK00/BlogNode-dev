import { AllowedTypes, SystemSetting } from '@src/interface/entities/systemSetting';

import { systemDao } from '../dao/systemDao';
import BaseService from './baseService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SystemService extends BaseService<SystemSetting<any>> {
  async get(name: string) {
    return systemDao.getSystemSetting(name);
  }

  async set<T>(name: string, value: AllowedTypes<T>, preload?: boolean) {
    return systemDao.setSystemSetting(name, value, preload);
  }
}

export default new SystemService();
