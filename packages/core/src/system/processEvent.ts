import _ from 'lodash';

import bus from './bus';
import { BlogNodeFatalError } from './error';
import { EventType } from './events';
import logging from './logging';

const logger = logging.systemLogger;

const exitSinals:NodeJS.Signals[] = [
  'SIGINT',
  'SIGTERM',
  'SIGBREAK',
  'SIGHUP',
];

const handleGracefulShutdown = _.once(async () => {
  logger.info('Shutting down BlogNode...');
  await bus.broadcast(EventType.SYS_BeforeSystemStop);
  await logging.handleShutdown();
});

function handlePromiseRejection(e:any) {
  if (e instanceof BlogNodeFatalError) {
    logger.fatal(e);
    process.exit(1);
  }
  logger.error(e);
}

async function handleProcessSignal(s:string) {
  logger.debug(`Received ${s}. Performing graceful shutdown...`);
  await handleGracefulShutdown();
  process.exit();
}

function registerEvents() {
  process.on('unhandledRejection', handlePromiseRejection);
  exitSinals.forEach((s) => process.once(s, handleProcessSignal));
}

export default {
  registerEvents,
};
