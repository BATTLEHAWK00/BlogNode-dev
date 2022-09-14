import Cluster, { Worker } from 'cluster';
import path from 'path';
import { getImportDirname } from '@src/util/paths';
// import { Piscina } from 'piscina';
import EventEmitter from 'events';
import logging from '../logging';
import { BlogNodeFatalError } from '../error';
import bus from '../bus';
// import bus from '../bus';

const logger = logging.systemLogger;
const workerFilePath = path.resolve(getImportDirname(import.meta), 'worker');
Cluster.setupPrimary({ exec: workerFilePath });

class WorkerManager extends EventEmitter {
  private onlineWorkers: Set<Worker> = new Set();
  private workerNum: number;

  constructor(workerNum = 1) {
    super();
    this.workerNum = workerNum;
  }

  private async startWorker() {
    return new Promise<void>((resolve) => {
      this.emit('worker:start');
      const worker = Cluster.fork();
      worker.on('error', (err) => {
        logger.error(`Worker ${worker.id} throwed an error:`, err);
        throw err;
      }).once('online', () => {
        this.onlineWorkers.add(worker);
        this.emit('worker:online', worker);
      }).on('message', (msg) => {
        if (msg.id) this.emit('worker:event', worker, msg.eventName, ...msg.payloads);
      });
      this.once('worker:event', (worker, name) => {
        if (name === 'loaded') resolve();
      });
    });
  }

  async startWorkers() {
    const timeout = setTimeout(() => {
      throw new BlogNodeFatalError('Workers start timed out.');
    }, 30000);
    await Promise.all([...Array(this.workerNum).keys()].map(() => this.startWorker()));
    clearTimeout(timeout);
  }

  async close() {
    return Promise.all([...this.onlineWorkers].map((worker) => new Promise<void>((resolve, reject) => {
      worker.kill();
      worker.on('exit', () => resolve());
    })));
  }
}

// function broadcastMsg(msg: unknown) {
//   workerList.forEach((w) => w.postMessage(msg));
// }

async function init(workerNum = 1): Promise<void> {
  logger.info(`Initializing ${workerNum} workers...`);
  const manager = new WorkerManager(workerNum);
  await manager.startWorkers();
  bus.once('system/beforeStop', async () => {
    logger.debug('Closing workers...');
    return manager.close();
  });
}

export default {
  init,
};
