import fs from 'fs/promises';
import path from 'path';

import chalk from 'chalk';
import os from 'os';
import bus from './system/bus';
import config from './system/config';
import logging from './system/logging';
import processEvent from './system/processEvent';
import { Timer } from './util/system-utils';
import { getImportDirname } from './util/paths';
import mainProcess from './system/cluster/main';

const logger = logging.systemLogger;
const isDev = process.env.NODE_ENV === 'development';

// register process events
processEvent.registerEvents();

// print banner
const bannerText = await fs.readFile(path.resolve(getImportDirname(import.meta), './banner.txt'), { encoding: 'utf-8' });
logger.info(chalk.cyanBright(bannerText));

logger.info(`Starting in ${isDev ? 'development' : 'production'} mode.`);
logger.trace('System config:', config);

// bind timer
const timer: Timer = new Timer();
const timePromise = timer.measureEvents(
  'system/beforeStart',
  'system/started',
);

// initialization
await bus.broadcast('system/beforeStart');
// logger.info('Loading system...');
// await loader.load();
await mainProcess.init(os.cpus().length);
await bus.broadcast('system/started');
logger.info(`BlogNode started in ${await timePromise}ms`);
