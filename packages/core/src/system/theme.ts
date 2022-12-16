import bus from './bus';
import renderer from './renderer';

class Theme {
  async loadTheme(name: string) {
    bus.emit('theme/loadTheme', name);
    // todo
  }

  async unloadTheme() {
    bus.emit('theme/unloadTheme', 'test');
  }

  async reload() {
    bus.emit('theme/beforeReload');
    await renderer.reload();
    await this.unloadTheme();
    await this.loadTheme();
    bus.emit('theme/reloadComplete');
  }
}
export default new Theme();
