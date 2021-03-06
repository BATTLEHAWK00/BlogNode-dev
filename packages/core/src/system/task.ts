import { getDatabaseUri } from '@src/util/system';
import { Timer } from '@src/util/utils';
import { Agenda, Job } from 'agenda';

import bus from './bus';
import logging from './logging';

const logger = logging.getLogger('taskScheduler');
const agenda = new Agenda({
  db: {
    address: getDatabaseUri(),
    collection: 'tasks',
  },
  maxConcurrency: 10,
});

function onTaskStarted(task: Job) {
  logger.debug(`Task execution ${task.attrs.name} started.`);
}

function onTaskSuccess(task: Job) {
  logger.debug(`Task execution ${task.attrs.name} success.`);
}

function onTaskFail(err: Error, task: Job) {
  logger.error(`Task execution ${task.attrs.name} failed!`);
  logger.error(err);
}

async function start(): Promise<void> {
  const timer = new Timer();
  logging.systemLogger.info('Starting task scheduler...');
  const time = await timer.decorate(async () => {
    agenda.on('success', onTaskSuccess);
    agenda.on('fail', onTaskFail);
    agenda.on('start', onTaskStarted);
    await agenda.start();
  });
  logging.systemLogger.debug(`Task scheduler started.(${time}ms)`);
  await bus.broadcast('task/started');
}

async function stop(): Promise<void> {
  logging.systemLogger.debug('Closing task pool...');
  await agenda.stop();
  await agenda.close();
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  start,
  stop,
  every: agenda.every.bind(agenda),
  now: agenda.now.bind(agenda),
  schedule: agenda.schedule.bind(agenda),
  define: agenda.define.bind(agenda),
  jobs: agenda.jobs.bind(agenda),
  cancel: agenda.cancel.bind(agenda),
  create: agenda.create.bind(agenda),
  disable: agenda.disable.bind(agenda),
  enable: agenda.enable.bind(agenda),
};
export default _default;
__blognode.task = _default;
