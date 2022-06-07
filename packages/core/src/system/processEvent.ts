import _ from 'lodash';

import bus from './bus';
import { EventType } from './events';
import logging from './logging';

const logger = logging.systemLogger;

const exitSinals:NodeJS.Signals[] = [
  'SIGINT',
  'SIGTERM',
  'SIGBREAK',
  'SIGHUP',
];

function handlePromiseRejection() {
  process.on('unhandledRejection', (e) => {
    logger.error(e);
  });
}

async function gracefulShutdown() {
  logger.info('Shutting down BlogNode...');
  await bus.broadcast(EventType.SYS_BeforeSystemStop);
  process.exit(0);
}

function handleProcessExit() {
  exitSinals.forEach((signal) => process.on(signal, gracefulShutdown));
}

export default {
  handleProcessExit: _.once(handleProcessExit),
  handlePromiseRejection,
};
