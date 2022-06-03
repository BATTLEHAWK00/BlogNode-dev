import mongoose, { Model } from 'mongoose';
import config from '@src/config';
import { Timer } from '@src/util/utils';
import bus from './bus';
import { EventType } from './events';
import logging from './logging';

const logger = logging.systemLogger;

const { dbConfig } = config;

const registeredModels:Map<string, Model<any>> = new Map();

async function connectDB() {
  return new Promise<void>((resolve, reject) => {
    const uri = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
    mongoose.connect(uri, { ...dbConfig.options, dbName: dbConfig.dbName }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function registerModel(model:Model<any>) {
  logger.debug(`Registered Model: ${model.modelName}`);
  registeredModels.set(model.modelName, model);
}

bus.once(EventType.SYS_BeforeDatabaseConnect, async () => {
  const timer = new Timer();
  logger.info('Connecting to Database...');
  const time = await timer.decorate(() => connectDB());
  logger.info(`Database connected.(${time}ms)`);
  bus.broadcast(EventType.SYS_DatabaseConnected);
});

bus.once(EventType.SYS_DatabaseConnected, async () => {
  const indexTimer = new Timer();
  indexTimer.start();
  await Promise.all([...registeredModels.values()].map(async (m) => {
    const timer = new Timer();
    const time = await timer.decorate(() => m.ensureIndexes());
    logger.debug(`Ensured indexes for model ${m.modelName} (${time}ms)`);
  }));
  indexTimer.end();
  logger.info(`Database indexes ensured.(${indexTimer.result()}ms)`);
});

export default {
  registerModel,
};
