import { worker } from 'workerpool';
import bus from './bus';
import logging from './logging';

async function init(): Promise<void> {
  await bus.emit('cluster/beforeWorkerStart');
  logging.getLogger().error('worker started');
  await bus.emit('cluster/workerStarted');
}

worker({
  init,
});
