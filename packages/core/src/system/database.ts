import config from '@src/system/config';
import { getDatabaseUri } from '@src/util/system';
import { Timer } from '@src/util/utils';
import mongoose, { Model } from 'mongoose';

import logging from './logging';

const logger = logging.getLogger('Database');

const { dbConfig } = config;

const registeredModels:Map<string, Model<any>> = new Map();

if (config.systemConfig.logLevel === 'trace') {
  mongoose.set('debug', (coll, method, query, doc) => {
    logger.trace(`[${method}]${coll}:`, JSON.stringify(query), doc);
  });
}

async function connect() {
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

async function disconnect() {
  await mongoose.disconnect();
}

export default {
  connect,
  ensureIndexes,
  registerModel,
  disconnect,
};
