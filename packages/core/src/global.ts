import routerRegistry from '@src/system/router';
import { postDao } from '@src/orm/dao/postDao';
import { systemDao } from '@src/orm/dao/systemDao';
import { userDao } from '@src/orm/dao/userDao';
import { systemService } from '@src/orm/service/systemService';
import bus from './system/bus';
import email from './system/email';
import i18n from './system/i18n';
import logging from './system/logging';
import settings from './system/settings';
import task from './system/task';

export interface BlogNode{
  bus?: typeof bus
  task?: typeof task
  dao: {
    userDao?: typeof userDao
    systemDao?: typeof systemDao
    postDao?: typeof postDao
  }
  service: {
    systemService?: typeof systemService
  }
  routerRegistry?: typeof routerRegistry
  logging?: typeof logging
  email?: typeof email
  settings?: typeof settings
  i18n?: typeof i18n
}
