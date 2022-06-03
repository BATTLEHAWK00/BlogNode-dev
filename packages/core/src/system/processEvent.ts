import bus from './bus';
import { EventType } from './events';
import logging from './logging';

const logger = logging.getLogger('processEvent');

function handlePromiseRejection() {
  process.on('unhandledRejection', (e) => {
    logger.error(e);
  });
}

function handleProcessExit() {
  process
    .on('beforeExit', () => {
      bus.broadcast(EventType.SYS_BeforeSystemStop).then(() => {
        process.exit();
      });
    })
    .on('SIGINT', () => {
      bus.broadcast(EventType.SYS_BeforeSystemStop).then(() => {
        process.exit();
      });
    });
}

export default {
  handleProcessExit,
  handlePromiseRejection,
};
