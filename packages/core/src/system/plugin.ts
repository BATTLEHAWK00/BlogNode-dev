import BlogNodeError from '@/error/BlogNodeError';
import { IPlugin } from '@/interface/plugin';
import bus from './bus';
import logging from './logging';

const logger = logging.getLogger();

class Plugin {
  private pluginList: IPlugin[] = [];

  private loadedPluginMap: Map<string, IPlugin> = new Map();

  async scanPlugins() {
    bus.emit('plugin/scanStart');
    logger.info('Scanning plugins...');
    bus.emit('plugin/scanComplete');
  }

  async loadPlugin(name: string) {
    if (this.loadedPluginMap.has(name)) {
      throw new BlogNodeError('Plugin already loaded');
    }
    logger.info('Loading plugin: ', name);

    bus.emit('plugin/loadPlugin', name);
  }

  async unloadPlugin(name: string) {
    if (!this.loadedPluginMap.has(name)) return;
    logger.info('Unloading plugin: ', name);
    this.loadedPluginMap.delete(name);
    bus.emit('plugin/unloadPlugin', name);
  }

  async enablePlugin(name: string) {
    this.loadPlugin(name);
    bus.emit('plugin/pluginEnabled', name);
  }

  async disablePlugin(name: string) {
    this.unloadPlugin(name);
    bus.emit('plugin/pluginDisabled', name);
  }

  async reloadPlugins() {
    logger.info('Reloading plugins...');
    bus.emit('plugin/reloadPlugins');
    const pluginKeys = [...this.loadedPluginMap.keys()];
    await Promise.all(pluginKeys.map(name => this.unloadPlugin(name)));
    await Promise.all(pluginKeys.map(name => this.loadPlugin(name)));
  }

  async checkUpdates() {
    bus.emit('plugin/checkUpdates');
  }
}

export default new Plugin();
