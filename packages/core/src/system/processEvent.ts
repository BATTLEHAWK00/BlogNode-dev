import { once } from 'lodash';

import bus from './bus';
import { BlogNodeFatalError } from './error';
import logging from './logging';

const logger = logging.systemLogger;

const exitSignals: NodeJS.Signals[] = [
  'SIGINT',
  'SIGTERM',
  'SIGBREAK',
  'SIGHUP',
];

const handleGracefulShutdown = once(async (s: string) => {
  logger.info('Shutting down BlogNode...');
  await bus.broadcast('system/beforeStop', s);
  await logging.handleShutdown();
});

function handlePromiseRejection(e: Error): void {
  if (e instanceof BlogNodeFatalError) {
    logger.fatal(e);
    process.exit(1);
  }
  logger.error(e);
}

async function handleProcessSignal(s: string) {
  logger.debug(`Received ${s}. Performing graceful shutdown...`);
  await handleGracefulShutdown(s);
  process.exit();
}

function registerEvents(): void {
  process.on('unhandledRejection', handlePromiseRejection);
  exitSignals.forEach((s) => process.once(s, handleProcessSignal));
}

export default {
  registerEvents,
};
