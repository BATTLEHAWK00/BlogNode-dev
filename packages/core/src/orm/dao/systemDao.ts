import { AllowedTypes, SystemSetting } from '@src/interface/entities/systemSetting';
import cache from '@src/system/cache';
import logging from '@src/system/logging';
import settings from '@src/system/settings';
import _ from 'lodash';
import LRUCache from 'lru-cache';
import mongoose, { Model } from 'mongoose';

import systemSettingSchema from '../schema/systemSettingSchema';
import BaseDao from './baseDao';

function getCacheKeyByName(name: string) {
  return `name:${name}`;
}

export default class SystemDao extends BaseDao<SystemSetting<unknown>> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected setModel(): Model<SystemSetting<unknown>, {}, {}, {}> {
    return mongoose.model('setting', systemSettingSchema);
  }

  protected setCache(): LRUCache<string, SystemSetting<unknown>> {
    return cache.getCache<SystemSetting<unknown>>(200, 1000 * 60 * 60 * 12);
  }

  protected setLoggerName(): string {
    return 'SystemDao';
  }

  async getSystemSetting<T>(name: string): Promise<AllowedTypes<T> | null> {
    const op = this.cached()
      .single
      .ifUncached(async () => this.model.findOne({ _id: name }));
    const res = await op.get(getCacheKeyByName(name));
    return <T>res?.value || null;
  }

  async setSystemSetting<T>(name: string, value: AllowedTypes<T>, preload?: boolean): Promise<void> {
    await this.model.updateOne({ _id: name }, { $set: { value, preload } }, { upsert: true });
    this.cache.delete(getCacheKeyByName(name));
  }

  private async preloadSettings(): Promise<void> {
    const res: SystemSetting<unknown>[] = await this.model.find({ preload: true });
    res.forEach((setting) => this.cache.set(getCacheKeyByName(setting._id), setting));
    this.logger.debug(`Preloaded ${res.length} settings.`);
    this.logger.trace('Preloaded settings:', res.map((s) => s._id).join(', '));
  }

  private async initSettings(): Promise<void> {
    const defaultSettings: SystemSetting<unknown>[] = settings.getSettings()
      .map(({ name, defaultValue, preload }) => ({
        _id: name,
        value: defaultValue instanceof Function ? defaultValue() : defaultValue,
        preload,
      }));
    const docs: SystemSetting<unknown>[] = await this.model.find(
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
