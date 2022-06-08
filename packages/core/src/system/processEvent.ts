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
async function gracefulShutdown() {
  logger.info('Shutting down BlogNode...');
  await bus.broadcast(EventType.SYS_BeforeSystemStop);
  await logging.handleShutdown();
  process.exit(0);
}

function handlePromiseRejection() {
  process.on('unhandledRejection', (e) => {
    if (e instanceof BlogNodeFatalError) {
      logger.fatal(e);
      process.exit(1);
    }
    logger.error(e);
  });
}

function handleProcessExit() {
  exitSinals.forEach((signal) => process.on(signal, gracefulShutdown));
}

export default {
  handleProcessExit: _.once(handleProcessExit),
  handlePromiseRejection,
};
