import bus from './bus';

class Renderer {
  async loadRenderer(name: string) {
    bus.emit('renderer/loadRenderer', name);
  }

  async reload() {}

  async render(pageName: string, pageData: unknown) {
    bus.emit('renderer/beforeRender');
    bus.emit('renderer/renderComplete');
  }
}

export default new Renderer();
