import { Plugin } from '@src/interface/entities/plugin';
import mongoose, { Model } from 'mongoose';
import plugin from '../schema/plugin';
import BaseDao from './baseDao';

class PluginDao extends BaseDao<Plugin> {
  protected setLoggerName(): string {
    return 'PluginDao';
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
