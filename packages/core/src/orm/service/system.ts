import { SystemSetting } from '@src/interface/entities/systemSetting';

import { systemDao } from '../dao/systemDao';
import BaseService from './baseService';

class SystemService extends BaseService<SystemSetting> {
  async get(name:string) {
    return systemDao.getSystemSetting(name);
  }

  async set(name:string, value:any, preload?:boolean) {
    return systemDao.setSystemSetting(name, value, preload);
  }
}

export default new SystemService();
