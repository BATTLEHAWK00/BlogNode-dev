import fs from 'fs';
import path from 'path';

import bus from './system/bus';
import config from './system/config';
import logging from './system/logging';
import processEvent from './system/processEvent';
import { Timer } from './util/utils';
import loader from './system/manager/loader';

const logger = logging.systemLogger;

const isDev = process.env.NODE_ENV === 'development';

async function bindTimer() {
  const timer: Timer = new Timer();
  const time = await timer.measureEvents(
    'system/beforeStart',
    'system/started',
  );
  logger.info(`BlogNode started in ${time}ms`);
}

function printBanner() {
  const bannerText = fs.readFileSync(path.resolve(__dirname, './banner.txt'), { encoding: 'utf-8' });
  logger.info(bannerText);
}

if (global.gc) bus.on('system/gc', () => global.gc && global.gc());
bus.once('system/started', () => bus.broadcast('system/gc'));

(async () => {
  processEvent.registerEvents();
  printBanner();
  logger.info(`Starting in ${isDev ? 'development' : 'production'} mode.`);
  logger.trace('System config:', config);
  bindTimer();
  await bus.broadcast('system/beforeStart');
  logger.info('Loading system...');
  await loader.load();
  await bus.broadcast('system/started');
})();
