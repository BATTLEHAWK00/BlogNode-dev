import { IBus } from './bus';

export interface IEvents {
  'system/beforeStart': (bus: IBus) => void;
  'system/startComplete': () => void;
  'plugin/scanStart': () => void;
  'plugin/scanComplete': () => void;
  'plugin/beforeLoadPlugin': (name: string) => void;
  'plugin/pluginLoaded': (name: string) => void;
  'plugin/beforeUnloadPlugin': (name: string) => void;
  'plugin/pluginUnloaded': (name: string) => void;
  'plugin/pluginEnabled': (name: string) => void;
  'plugin/pluginDisabled': (name: string) => void;
  'plugin/reloadPlugins': () => void;
  'plugin/checkUpdates': () => void;
  'theme/loadTheme': (name: string) => void;
  'theme/unloadTheme': (name: string) => void;
  'theme/beforeReload': () => void;
  'theme/reloadComplete': () => void;
  'renderer/loadRenderer': (name: string) => void;
  'renderer/beforeRender': () => void;
  'renderer/renderComplete': () => void;
  'cluster/startWorker': () => void;
  'cluster/stopWorker': () => void;
}
