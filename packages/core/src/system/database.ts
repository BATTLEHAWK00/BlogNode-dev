import { Entity } from '@src/interface/interface';
import config from '@src/system/config';
import { getDatabaseUri } from '@src/util/system';
import { Timer } from '@src/util/utils';
import mongoose, { Model } from 'mongoose';
import { BlogNodeFatalError } from './error';

import logging from './logging';

const logger = logging.getLogger('DataBase');

const { dbConfig } = config;
const registeredModels: Map<string, Model<unknown>> = new Map();

if (config.systemConfig.logLevel === 'trace') {
  mongoose.set('debug', (coll, method, query, doc) => {
    logger.trace(`[${method}] ${coll}:`, query, doc);
  });
}

async function connect(): Promise<void> {
  const uri = getDatabaseUri();
  const {
    options, dbName, userName, password,
  } = dbConfig;
  mongoose.connection
    .on('reconnected', () => logger.info('Database reconnected.'))
    .on('disconnected', () => logger.info('Database disconnected.'));
  try {
    await mongoose.connect(uri, {
      ...options,
      dbName,
      user: userName,
      pass: password,
      autoIndex: false,
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 64,
      minPoolSize: 8,
      heartbeatFrequencyMS: 2000,
    });
  } catch (error) {
    throw new BlogNodeFatalError('DataBase connection failed.', { cause: error as Error });
  }
}

function registerModel<T extends Entity>(model: Model<T>): void {
  logging.systemLogger.debug(`Registered Model: ${model.modelName}`);
  registeredModels.set(model.modelName, <Model<unknown>> model);
}

async function ensureIndexes(logInfo = true): Promise<void> {
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

async function disconnect(): Promise<void> {
  await mongoose.disconnect();
}

export default {
  connect,
  ensureIndexes,
  registerModel,
  disconnect,
};
