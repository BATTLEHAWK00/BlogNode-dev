import bus from './system/bus';
import plugin from './system/plugin';

export default async function start(): Promise<void> {
  bus.emit('system/beforeStart', bus);
  await plugin.scanPlugins();
  
  bus.emit('system/startComplete');
}
