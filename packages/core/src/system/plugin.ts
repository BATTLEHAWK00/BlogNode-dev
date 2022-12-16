import { IPlugin } from '@/interfaces/plugin';
import bus from './bus';

class Plugin {
  private pluginList: IPlugin[] = [];

  async scanPlugins() {
    bus.emit('plugin/scanStart');
    
    bus.emit('plugin/scanComplete');
  }

  async loadPlugin(name: string) {
    bus.emit('plugin/loadPlugin', name);
  }

  async unloadPlugin(name: string) {
    bus.emit('plugin/unloadPlugin', name);
  }

  async reloadPlugins() {
    bus.emit('plugin/reloadPlugins');
  }

  async checkUpdates() {
    bus.emit('plugin/checkUpdates');
  }
}

export default new Plugin();
