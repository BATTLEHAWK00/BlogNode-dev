import fs from 'fs';
import path from 'path';

import bus from './system/bus';
import { EventType } from './system/events';
import logging from './system/logging';
import middleware from './system/middleware';
import systemMiddlewares from './system/middlewares/systemMiddlewares';
import moduleLoader from './system/moduleLoader';
import processEvent from './system/processEvent';
import { Timer } from './util/utils';

const logger = logging.systemLogger;

const isDev = process.env.NODE_ENV === 'development';

const bannerText = fs.readFileSync(path.resolve(__dirname, './banner.txt'), { encoding: 'utf-8' });
logger.info(bannerText);

async function bindTimer() {
  const timer: Timer = new Timer();
  const time = await timer.measureEvents(
    EventType.SYS_BeforeSystemStart,
    EventType.SYS_SystemStarted,
  );
  logger.info(`BlogNode started in ${time}ms`);
}

async function loadConfig() {
  return moduleLoader.loadModule(__dirname, 'config');
}

if (global.gc) bus.on(EventType.SYS_GC, () => global.gc && global.gc());
(async () => {
  logger.info(`Starting in ${isDev ? 'development' : 'production'} mode.`);
  processEvent.handlePromiseRejection();
  processEvent.handleProcessExit();
  bindTimer();
  await bus.broadcast(EventType.SYS_BeforeSystemStart);
  await loadConfig();
  logger.info('Loading modules...');
  await middleware.loadSystemMiddlewares(systemMiddlewares);
  bus.once(EventType.SYS_SystemStarted, () => bus.broadcast(EventType.SYS_GC));
})();
