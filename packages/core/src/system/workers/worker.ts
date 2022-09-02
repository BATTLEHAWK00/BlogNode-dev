import logging from '../logging';
import loader from '../manager/loader';
import cluster from './cluster';

const logger = logging.getLogger(`Worker ${cluster.workerId}`);
logger.debug(`Worker ${cluster.workerId} loading.`);
await loader.load();
logger.debug(`Worker ${cluster.workerId} loaded.`);
