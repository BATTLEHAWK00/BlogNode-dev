import Cluster from 'cluster';
import logging from '../logging';
import loader from '../manager/loader';
import { createWorkerMessage } from './message';

const workerId = Cluster.worker?.id;
const logger = logging.getLogger(`Worker-${workerId}`);

logger.debug(`Worker ${workerId} loading.`);
await loader.load();
if (process.send) process.send(createWorkerMessage('loaded'));

logger.debug(`Worker ${workerId} loaded.`);

