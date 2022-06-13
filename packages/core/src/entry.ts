import * as fs from 'fs';
import * as path from 'path';

import bus from './system/bus';
import config from './system/config';
import { EventType } from './system/events';
import logging from './system/logging';
import middleware from './system/middleware';
import processEvent from './system/processEvent';
import { Timer } from './util/utils';

const logger = logging.systemLogger;

const isDev = process.env.NODE_ENV === 'development';

async function bindTimer() {
  const timer: Timer = new Timer();
  const time = await timer.measureEvents(
    EventType.SYS_BeforeSystemStart,
    EventType.SYS_SystemStarted,
  );
  logger.info(`BlogNode started in ${time}ms`);
}

function printBanner() {
  const bannerText = fs.readFileSync(path.resolve(__dirname, './banner.txt'), { encoding: 'utf-8' });
  logger.info(bannerText);
}

if (global.gc) bus.on(EventType.SYS_GC, () => global.gc && global.gc());
bus.once(EventType.SYS_SystemStarted, () => bus.broadcast(EventType.SYS_GC));

(async () => {
  processEvent.registerEvents();
  printBanner();
  logger.info(`Starting in ${isDev ? 'development' : 'production'} mode.`);
  logger.trace('System config:', config);
  bindTimer();
  await bus.broadcast(EventType.SYS_BeforeSystemStart);
  logger.info('Loading modules...');
  const middlewares = (await import('./system/middlewares/systemMiddlewares')).default;
  await middleware.loadSystemMiddlewares(middlewares);
  bus.broadcast(EventType.SYS_SystemStarted);
})();
