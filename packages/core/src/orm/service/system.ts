import { CompoundTypes, SystemSetting } from '@src/interface/entities/systemSetting';

import { systemDao } from '../dao/systemDao';
import BaseService from './baseService';

export default class SystemService extends BaseService<SystemSetting> {
  async get<T extends CompoundTypes>(name: string): Promise<T | null> {
    return systemDao.getSystemSetting(name) as Promise<T | null>;
  }

  async set(name: string, value: CompoundTypes, preload?: boolean): Promise<void> {
    return systemDao.setSystemSetting(name, value, preload);
  }
}

export const systemService = new SystemService();
__blognode.service.systemService = systemService;
