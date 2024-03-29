import BlogNodeError from '@/error/BlogNodeError';
import threads from 'worker_threads';
import { cpus } from 'os';
import path from 'path';
import workerpool from 'workerpool';
import logging from './logging';
import { useTimer } from '@/util/timer';

const cpuCount = cpus().length;
const workerPath = path.resolve(__dirname, 'worker.ts');

const logger = logging.getLogger();

declare module 'workerpool' {
  interface WorkerPoolOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workerThreadOpts: any;
    maxQueueSize: number;
  }
}

const workerPool = workerpool.pool(workerPath, {
  workerType: 'thread',
  maxWorkers: cpuCount,
  maxQueueSize: 1e4,
  workerThreadOpts: {
    execArgv: ['-r', 'ts-node/register'],
  },
});

async function start(): Promise<void> {
  if (!threads.isMainThread) {
    throw new BlogNodeError('Worker cannot start threads.');
  }
  const timer = useTimer();
  logger.info('Starting workers...');
  timer.start();
  const workerProxy = await workerPool.proxy();
  const startPromises = [...Array(cpuCount)].map(() => workerProxy.init());
  await Promise.all(startPromises);
  timer.stop();
  logger.info(`Workers started. (${timer.getTime()} ms)`);
}

export default {
  start,
};
