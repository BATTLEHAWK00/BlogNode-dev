import { CompoundTypes, SystemSetting } from '@src/interface/entities/systemSetting';
import bus from '@src/system/bus';
import { createSharedCache, wrapSharedCache } from '@src/system/cache';
import logging from '@src/system/logging';
import moduleLoader from '@src/system/moduleLoader';
import settings from '@src/system/settings';
import { fromSrc } from '@src/util/paths';
import _ from 'lodash';
import mongoose, { Model } from 'mongoose';

import systemSettingSchema from '../schema/systemSetting';
import BaseDao from './baseDao';

export default class SystemDao extends BaseDao<SystemSetting> {
  private cache = createSharedCache<unknown>('entity:system');

  protected setModel(): Model<SystemSetting> {
    return mongoose.model('setting', systemSettingSchema);
  }

  protected setLoggerName(): string {
    return 'SystemDao';
  }

  async getSystemSetting(name: string): Promise<CompoundTypes | null> {
    if (await this.cache.has(name)) {
      return this.cache.get(name) as Promise<CompoundTypes | null>;
    }
    const res = await this.model.findOne({ _id: name });
    await this.cache.set(name, res?.value, 500);
    return res?.value || null;
  }

  async setSystemSetting(name: string, value: CompoundTypes, preload?: boolean): Promise<void> {
    await this.model.updateOne({ _id: name }, { $set: { value, preload } }, { upsert: true });
    this.cache.del(name);
  }

  private async preloadSettings(): Promise<void> {
    const res: SystemSetting[] = await this.model.find({ preload: true });
    res.forEach((setting) => this.cache.set(setting._id, setting.value));
    this.logger.debug(`Preloaded ${res.length} settings.`);
    this.logger.trace('Preloaded settings:', res.map((s) => s._id).join(', '));
  }

  private async initSettings(): Promise<void> {
    await bus.broadcast('settings/beforeInit');
    await moduleLoader.loadModule(fromSrc('system/extendable/settings'));
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
