import { IBus, IPluginBus } from './bus';

interface IPluginContext {
  bus: IBus;
  pluginBus: IPluginBus;
}

export interface IPlugin {
  onRegister: () => void | Promise<void>;
  onLoad: (context: IPluginContext) => void | Promise<void>;
  onUnload: (context: IPluginContext) => void | Promise<void>;
}
