import { SystemSetting } from '@src/interface/entities/systemSetting';
import cache, { CacheOperation, cacheOperation } from '@src/system/cache';
import mongoose, { Model } from 'mongoose';

import systemSettingSchema from '../schema/systemSettingSchema';
import BaseDao from './baseDao';

function getCacheKeyByName(name:string) {
  return `name:${name}`;
}

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

  async getSystemSetting(name:string):Promise<any> {
    const op = this.getCache()
      .single
      .ifUncached(async () => this.getModel().findOne({ _id: name }));
    const res = await op.get(getCacheKeyByName(name));
    return res?.toObject().value || null;
  }

  async setSystemSetting(name:string, value:any) {
    await this.getModel().updateOne({ _id: name }, { $set: { value } }, { upsert: true });
    this.getCache().evict(getCacheKeyByName(name));
  }
}

export default new SystemDao();
