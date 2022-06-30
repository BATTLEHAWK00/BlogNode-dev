import { postDao } from '@src/orm/dao/postDao';
import { systemDao } from '@src/orm/dao/systemDao';
import { userDao } from '@src/orm/dao/userDao';
import { systemService } from '@src/orm/service/system';
import bus from './system/bus';
import email from './system/email';
import i18n from './system/i18n';
import logging from './system/logging';
import settings from './system/settings';
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
    email: typeof email
    settings: typeof settings
    i18n: typeof i18n
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention,vars-on-top,no-var
  var __blognode: BlogNode;
}

global.__blognode = {
  task,
  bus,
  logging,
  email,
  settings,
  i18n,
  dao: {
    userDao,
    systemDao,
    postDao,
  },
  service: {
    systemService,
  },
};
