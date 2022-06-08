import bus from '@src/system/bus';
import database from '@src/system/database';
import { EventType } from '@src/system/events';
import logging from '@src/system/logging';
import moduleLoader from '@src/system/moduleLoader';
import task from '@src/system/task';
import { fromSrc } from '@src/util/system';
import { Timer } from '@src/util/utils';
import path from 'path';

import { SystemMiddleware } from '../../middleware';

const daoDir = path.resolve(__dirname, fromSrc('orm/dao'));
const serviceDir = path.resolve(__dirname, fromSrc('orm/service'));

async function loadDao() {
  moduleLoader.loadDir(daoDir, true);
}
async function loadService() {
  moduleLoader.loadDir(serviceDir, true);
}

class DatabaseMiddleware extends SystemMiddleware {
  async onInit(): Promise<void> {
    await loadDao();
    await loadService();
    await bus.broadcast(EventType.SYS_BeforeDatabaseConnect);
    const timer = new Timer();
    logging.systemLogger.info('Connecting to database...');
    const time = await timer.decorate(() => database.connect());
    logging.systemLogger.debug(`Database connected.(${time}ms)`);
    await bus.broadcast(EventType.SYS_DatabaseConnected);
  }

  onRegisterEvents(): void {
    bus.once(EventType.SYS_BeforeSystemStop, async () => {
      logging.systemLogger.debug('Closing database...');
      await database.disconnect();
    });
    bus.once(EventType.SYS_DatabaseConnected, () => database.ensureIndexes(true));
    bus.once(EventType.SYS_TaskPoolStarted, async () => {
      task.define('ensureIndexes', { priority: -20 }, () => database.ensureIndexes(false));
      await task.every('6 hours', 'ensureIndexes');
    });
  }
}

export default new DatabaseMiddleware();
