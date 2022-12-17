import bus from './system/bus';
import cluster from './system/cluster';
import logging from './system/logging';
import plugin from './system/plugin';
import { useTimer } from './util/timer';

const logger = logging.getLogger();

function handleProcessEvents() {
  process
    .on('uncaughtException', e => {
      logger.fatal('Uncaught exception: ', e);
      process.exit(1);
    })
    .on('unhandledRejection', e => {
      logger.fatal('Unhandled rejection: ', e);
      process.exit(1);
    });
}

export default async function start(): Promise<void> {
  const timer = useTimer();
  handleProcessEvents();
  bus.emit('system/beforeStart', bus);
  logger.info('Starting system...');
  timer.start();
  await plugin.scanPlugins();
  cluster.start();
  bus.emit('system/startComplete');
  timer.stop();
  logger.info(`Starting complete. (${timer.getTime()} ms)`);
}
