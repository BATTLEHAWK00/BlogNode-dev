import { IBus } from './bus';

export interface IEvents {
  'system/beforeStart': (bus: IBus) => void;
  'system/startComplete': () => void;
  'plugin/scanStart': () => void;
  'plugin/scanComplete': () => void;
  'plugin/loadPlugin': (name: string) => void;
  'plugin/unloadPlugin': (name: string) => void;
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
