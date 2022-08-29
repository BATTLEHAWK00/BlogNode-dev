import { Plugin } from '@src/interface/entities/plugin';
import cache from '@src/system/cache';
import LRUCache from 'lru-cache';
import mongoose, { Model } from 'mongoose';
import plugin from '../schema/plugin';
import BaseDao from './baseDao';

class PluginDao extends BaseDao<Plugin> {
  protected setLoggerName(): string {
    return 'PluginDao';
  }

  protected setCache(): LRUCache<string, Plugin> {
    return cache.getCache<Plugin>(400);
  }
  protected setModel(): Model<Plugin> {
    return mongoose.model('plugin', plugin);
  }

  async getPlugins(): Promise<Plugin[]> {
    return this.model.find();
  }

  async updatePluginData(pluginName: string, data: unknown): Promise<void> {
    await this.model.findOneAndUpdate({ _id: pluginName }, { $set: { data } });
  }
}

export default new PluginDao();
