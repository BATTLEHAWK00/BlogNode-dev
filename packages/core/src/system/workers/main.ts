import Cluster from 'cluster';
import os from 'os';
import path from 'path';
import { getImportDirname } from '@src/util/paths';
// import { Piscina } from 'piscina';
import logging from '../logging';
import loader from '../manager/loader';
// import bus from '../bus';

const logger = logging.getLogger('MainThread');

const workerFilePath = path.resolve(getImportDirname(import.meta), 'worker');

// const taskPool = new Piscina();

Cluster.setupPrimary({ exec: workerFilePath });

function startWorker() {
  const worker = Cluster.fork();
  // worker.on('message', (msg) => {
  //   logger.info(msg);
  // });
  worker.on('error', (err) => {
    logger.error(`Worker ${worker.id} throwed an error:`, err);
  });
}

// function loadBalancedMsg(msg: unknown) {
//   loadBalanceIdx = (loadBalanceIdx + 1) % workerList.length;
//   workerList[loadBalanceIdx].postMessage(msg);
// }

// function broadcastMsg(msg: unknown) {
//   workerList.forEach((w) => w.postMessage(msg));
// }
async function init() {
  logger.info(`Initializing ${os.cpus.length} workers...`);
  for (let i = 0; i < 4; i++) startWorker();
  // bus.on('worker/loadbalancedMsg', loadBalancedMsg);
  // bus.on('worker/broadcastMsg', broadcastMsg);
}

export default {
  init,
};
