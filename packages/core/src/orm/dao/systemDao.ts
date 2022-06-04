import { SystemSetting } from '@src/interface/entities/systemSetting';
import cache, { cacheOperation, CacheOperation } from '@src/system/cache';
import logging from '@src/system/logging';
import mongoose, { Model } from 'mongoose';
import systemSettingSchema from '../schema/systemSettingSchema';
import BaseDao from './baseDao';

class SystemDao extends BaseDao<SystemSetting> {
  protected setModel(): Model<SystemSetting, {}, {}, {}> {
    return mongoose.model('setting', systemSettingSchema);
  }

  protected setCacheOperation(): CacheOperation<SystemSetting> {
    return cacheOperation(cache.getCache());
  }

  protected setLoggerName(): string {
    return 'SystemDao';
  }
}

export default new SystemDao();
