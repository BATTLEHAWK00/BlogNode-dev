import config from '@src/config';
import { Timer } from '@src/util/utils';
import mongoose, { Model } from 'mongoose';

import bus from './bus';
import { EventType } from './events';
import logging from './logging';

const logger = logging.getLogger('Database');

const { dbConfig } = config;

const registeredModels:Map<string, Model<any>> = new Map();

if (config.systemConfig.logLevel === 'trace') {
  mongoose.set('debug', (coll, method, query, doc) => {
    logger.trace(`[${method}]${coll}:`, JSON.stringify(query), doc);
  });
}

function getDatabaseUri() {
  return `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
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

async function ensureIndexes() {
  const indexTimer = new Timer();
  const totalTime = await indexTimer.decorate(
    () => Promise.all([...registeredModels.values()].map(async (m) => {
      const timer = new Timer();
      const time = await timer.decorate(() => m.ensureIndexes());
      logger.debug(`Ensured indexes for model ${m.modelName} (${time}ms)`);
    })),
  );
  logger.info(`Database indexes ensured.(${totalTime}ms)`);
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

bus.once(EventType.SYS_DatabaseConnected, () => bus.broadcast(EventType.DB_EnsureIndexes));

export default {
  registerModel,
  getDatabaseUri,
};
