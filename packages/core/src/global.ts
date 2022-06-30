import { postDao } from '@src/orm/dao/postDao';
import { systemDao } from '@src/orm/dao/systemDao';
import { userDao } from '@src/orm/dao/userDao';
import { systemService } from '@src/orm/service/system';
import bus from './system/bus';
import logging from './system/logging';
import task from './system/task';

declare global{
  interface BlogNode{
    bus: typeof bus,
    task: typeof task,
    dao: {
      userDao: typeof userDao,
      systemDao: typeof systemDao,
      postDao: typeof postDao
    },
    service: {
      systemService: typeof systemService,
    }
    logging: typeof logging
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention,vars-on-top,no-var
  var __blognode: BlogNode;
}

global.__blognode = {
  task,
  bus,
  logging,
  dao: {
    userDao,
    systemDao,
    postDao,
  },
  service: {
    systemService,
  },
};
