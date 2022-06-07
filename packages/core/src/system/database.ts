import config from '@src/config';
import { getDatabaseUri } from '@src/util/system';
import { Timer } from '@src/util/utils';
import mongoose, { Model } from 'mongoose';

import bus from './bus';
import { EventType } from './events';
import logging from './logging';
import task from './task';

const logger = logging.getLogger('Database');

const { dbConfig } = config;

const registeredModels:Map<string, Model<any>> = new Map();

if (config.systemConfig.logLevel === 'trace') {
  mongoose.set('debug', (coll, method, query, doc) => {
    logger.trace(`[${method}]${coll}:`, JSON.stringify(query), doc);
  });
}

async function connectDB() {
  return new Promise<void>((resolve, reject) => {
    const uri = getDatabaseUri();
    mongoose.connect(uri, { ...dbConfig.options, dbName: dbConfig.dbName }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function registerModel(model:Model<any>) {
  logging.systemLogger.debug(`Registered Model: ${model.modelName}`);
  registeredModels.set(model.modelName, model);
}

async function ensureIndexes(logInfo:boolean = true) {
  const indexTimer = new Timer();
  const totalTime = await indexTimer.decorate(
    () => Promise.all([...registeredModels.values()].map(async (m) => {
      const timer = new Timer();
      const time = await timer.decorate(() => m.ensureIndexes());
      logger.debug(`Ensured indexes for model ${m.modelName} (${time}ms)`);
    })),
  );
  if (logInfo) logger.info(`Database indexes ensured.(${totalTime}ms)`);
}

bus.on(EventType.DB_EnsureIndexes, ensureIndexes);

bus.once(EventType.SYS_BeforeDatabaseConnect, async () => {
  const timer = new Timer();
  logging.systemLogger.info('Connecting to database...');
  const time = await timer.decorate(() => connectDB());
  logging.systemLogger.debug(`Database connected.(${time}ms)`);
  await bus.broadcast(EventType.SYS_DatabaseConnected);
});

bus.once(EventType.SYS_BeforeSystemStop, async () => {
  logging.systemLogger.debug('Closing database...');
  await mongoose.disconnect();
});

bus.once(EventType.SYS_DatabaseConnected, () => bus.broadcast(EventType.DB_EnsureIndexes), false);
bus.once(EventType.SYS_TaskPoolStarted, async () => {
  task.define('ensureIndexes', { priority: -20 }, () => bus.broadcast(EventType.DB_EnsureIndexes, false));
  await task.every('6 hours', 'ensureIndexes');
});

export default {
  registerModel,
  getDatabaseUri,
};
