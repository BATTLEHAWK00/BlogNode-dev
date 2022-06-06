import { Timer } from '@src/util/utils';
import Agenda, { Job } from 'agenda';

import bus from './bus';
import database from './database';
import { EventType } from './events';
import logging from './logging';

const logger = logging.getLogger('taskScheduler');

const agenda = new Agenda({
  db: {
    address: database.getDatabaseUri(),
    collection: 'tasks',
  },
  maxConcurrency: 10,
});

function onTaskStarted(task:Job) {
  logger.debug(`Task execution ${task.attrs.name} started.`);
}

function onTaskFinished(task:Job) {
  logger.debug(`Task execution ${task.attrs.name} finished.`);
}

function onTaskSuccess(task:Job) {
  logger.debug(`Task execution ${task.attrs.name} success.`);
}

function onTaskFail(err:any, task:Job) {
  logger.error(`Task execution ${task.attrs.name} failed!`);
  logger.error(err);
}

bus.once(EventType.SYS_DatabaseConnected, async () => {
  const timer = new Timer();
  logging.systemLogger.info('Starting task scheduler...');
  const time = await timer.decorate(async () => {
    agenda.on('success', onTaskSuccess);
    agenda.on('fail', onTaskFail);
    agenda.on('complete', onTaskFinished);
    agenda.on('start', onTaskStarted);
    await agenda.start();
  });
  logging.systemLogger.debug(`Task scheduler started.(${time}ms)`);
});

bus.once(EventType.SYS_BeforeSystemStop, async () => {
  logging.systemLogger.debug('Closing task pool...');
  await agenda.stop();
  await agenda.close();
});
