import bus from './bus';
import { EventType } from './events';
import logging from './logging';

const logger = logging.systemLogger;
let isShuttingDown = false;

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
  if (isShuttingDown) return;
  isShuttingDown = true;
  exitSinals.forEach((signal) => process.on(signal, gracefulShutdown));
}

export default {
  handleProcessExit,
  handlePromiseRejection,
};
