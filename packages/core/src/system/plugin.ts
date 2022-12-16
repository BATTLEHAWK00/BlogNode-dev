import { IPlugin } from '@/interfaces/plugin';
import bus from './bus';
import logging from './logging';

const logger = logging.getLogger();

class Plugin {
  private pluginList: IPlugin[] = [];

  async scanPlugins() {
    bus.emit('plugin/scanStart');
    logger.info('Scanning plugins...');
    bus.emit('plugin/scanComplete');
  }

  async loadPlugin(name: string) {
    bus.emit('plugin/loadPlugin', name);
    logger.info('Loading plugin: ', name);
  }

  async unloadPlugin(name: string) {
    bus.emit('plugin/unloadPlugin', name);
    logger.info('Unloading plugin: ', name);
  }

  async enablePlugin(name: string) {
    bus.emit('plugin/pluginEnabled', name);
  }
  
  async disablePlugin(name: string) {
    bus.emit('plugin/pluginDisabled', name);
  }

  async reloadPlugins() {
    bus.emit('plugin/reloadPlugins');
    logger.info('Reloading plugins...');
  }

  async checkUpdates() {
    bus.emit('plugin/checkUpdates');
  }
}

export default new Plugin();
