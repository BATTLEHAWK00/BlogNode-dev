import config from '@src/system/config';
import Thread from 'worker_threads';
import Log4js from 'log4js';
import Cluster from 'cluster';
import cluster from './workers/cluster';

// const logLevel = config.systemConfig.logLevel || 'debug';
const logLevel = 'debug';

Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: {
    default: { appenders: ['console'], level: logLevel },
  },
});

function getLogger(name: string): Log4js.Logger {
  const nodeName = cluster.workerId !== undefined ? `[Worker-${cluster.workerId}]` : 'Main';
  return Log4js.getLogger(`${nodeName}-${name}`);
}

const systemLogger = getLogger('BlogNode');
systemLogger.log(logLevel, `Log level: ${logLevel}`);

function handleShutdown(): Promise<void> {
  systemLogger.debug('Shutting down loggers...');
  return new Promise<void>((resolve, reject) => Log4js.shutdown((err) => {
    if (err) reject(err);
    resolve();
  }));
}

export default {
  getLogger,
  systemLogger,
  handleShutdown,
};
