import bus from './system/bus';
import logging from './system/logging';
import plugin from './system/plugin';
import { useTimer } from './util/timer';

const logger = logging.getLogger();

export default async function start(): Promise<void> {
  const timer = useTimer();
  bus.emit('system/beforeStart', bus);
  logger.info('Starting system...');
  timer.start();
  await plugin.scanPlugins();
  bus.emit('system/startComplete');
  timer.stop();
  logger.info(`Starting complete. (${timer.getTime()} ms)`);
}
