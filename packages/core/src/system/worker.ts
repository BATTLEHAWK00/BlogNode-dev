import { worker } from 'workerpool';
import logging from './logging';

async function init(): Promise<void> {
  logging.getLogger().error('worker started');
}

worker({
  init,
});
