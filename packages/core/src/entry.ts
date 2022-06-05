import fs from 'fs';
import path from 'path';

import bus from './system/bus';
import { EventType } from './system/events';
import logging from './system/logging';
import moduleLoader from './system/moduleLoader';
import { Timer } from './util/utils';

const logger = logging.systemLogger;

const isDev = process.env.NODE_ENV === 'development';

const daoDir = path.resolve(__dirname, 'orm/dao');
const systemDir = path.resolve(__dirname, 'system');
const serviceDir = path.resolve(__dirname, 'orm/service');

const bannerText = fs.readFileSync(path.resolve(__dirname, './banner.txt'), { encoding: 'utf-8' });
logger.info(bannerText);

function bindTimer() {
  const timer: Timer = new Timer();
  timer.measureEvents(EventType.SYS_BeforeSystemStart, EventType.SYS_SystemStarted)
    .then((time) => {
      logger.info(`BlogNode started in ${time}ms`);
    });
}

async function loadConfig() {
  moduleLoader.loadModule(__dirname, 'config');
}

async function loadSystem() {
  const files = moduleLoader
    .scanDir(systemDir, moduleLoader.getModuleRegex())
    .map((file) => moduleLoader.splitModuleName(file))
    .filter((file) => !['server'].includes(file));
  moduleLoader.loadFiles(systemDir, files, true);
}

async function loadDao() {
  moduleLoader.loadDir(daoDir, true);
}

async function loadService() {
  moduleLoader.loadDir(serviceDir, true);
}
if (global.gc) bus.on(EventType.SYS_GC, () => global.gc && global.gc());
(async () => {
  logger.info(`Starting in ${isDev ? 'development' : 'production'} mode.`);
  bindTimer();
  await bus.broadcast(EventType.SYS_BeforeSystemStart);
  await loadConfig();
  logger.info('Loading modules...');
  logger.debug('Loading system...');
  await loadSystem();
  logger.debug('Loading dao...');
  await loadDao();
  logger.debug('Loading db...');
  await bus.broadcast(EventType.SYS_BeforeDatabaseConnect);
  logger.debug('Loading service...');
  await loadService();
  logger.debug('Loading server...');
  await moduleLoader.loadModule(systemDir, 'server');
  bus.once(EventType.SYS_SystemStarted, () => bus.broadcast(EventType.SYS_GC));
})();
