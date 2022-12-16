import { IBus, IPluginBus } from './bus';

interface IPluginContext {
  bus: IBus;
  pluginBus: IPluginBus;
}

export interface IPlugin {
  onLoad: (context: IPluginContext) => void | Promise<void>;
  onUnload: (context: IPluginContext) => void | Promise<void>;
  onEnabled: () => void | Promise<void>;
  onDisabled: () => void | Promise<void>;
}
