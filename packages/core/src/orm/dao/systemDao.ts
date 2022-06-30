import { CompoundTypes, SystemSetting } from '@src/interface/entities/systemSetting';
import bus from '@src/system/bus';
import cache from '@src/system/cache';
import logging from '@src/system/logging';
import moduleLoader from '@src/system/moduleLoader';
import settings from '@src/system/settings';
import { cacheKey, SRC_DIR } from '@src/util/utils';
import _ = require('lodash');
import * as LRUCache from 'lru-cache';
import mongoose, { Model } from 'mongoose';

import systemSettingSchema from '../schema/systemSettingSchema';
import BaseDao from './baseDao';

const getCacheKeyByName = cacheKey('name');

export default class SystemDao extends BaseDao<SystemSetting> {
  protected setModel(): Model<SystemSetting> {
    return mongoose.model('setting', systemSettingSchema);
  }

  protected setCache(): LRUCache<string, SystemSetting> {
    return cache.getCache<SystemSetting>(200, 1000 * 60 * 60 * 12);
  }

  protected setLoggerName(): string {
    return 'SystemDao';
  }

  async getSystemSetting(name: string): Promise<CompoundTypes | null> {
    const op = this.cached()
      .single
      .ifUncached(async () => this.model.findOne({ _id: name }));
    const res = await op.get(getCacheKeyByName(name));
    return res?.value || null;
  }

  async setSystemSetting(name: string, value: CompoundTypes, preload?: boolean): Promise<void> {
    await this.model.updateOne({ _id: name }, { $set: { value, preload } }, { upsert: true });
    this.cache.delete(getCacheKeyByName(name));
  }

  private async preloadSettings(): Promise<void> {
    const res: SystemSetting[] = await this.model.find({ preload: true });
    res.forEach((setting) => this.cache.set(getCacheKeyByName(setting._id), setting));
    this.logger.debug(`Preloaded ${res.length} settings.`);
    this.logger.trace('Preloaded settings:', res.map((s) => s._id).join(', '));
  }

  private async initSettings(): Promise<void> {
    await bus.broadcast('settings/beforeInit');
    await moduleLoader.loadModule(SRC_DIR, 'system/extendable/settings');
    const defaultSettings: SystemSetting[] = settings.getSettings()
      .map(({ name, defaultValue, preload }) => ({
        _id: name,
        value: defaultValue instanceof Function ? defaultValue() : defaultValue,
        preload,
      }));
    const docs: SystemSetting[] = await this.model.find(
      { _id: defaultSettings.map((s) => s._id) },
      { _id: 1 },
    );
    const newSettings = _.differenceBy(defaultSettings, docs, (s) => s._id);
    if (!newSettings.length) return;
    logging.systemLogger.info('Initializing settings...');
    await this.model.insertMany(newSettings);
  }

  protected async onDatabaseConnected(): Promise<void> {
    await this.initSettings();
    await this.preloadSettings();
  }
}

export const systemDao = new SystemDao();
