import { SystemMiddleware } from '../middleware';
import database from './system/database';
import email from './system/email';
import i18n from './system/i18n';
import server from './system/server';
import task from './system/task';

const systemMiddlewares: SystemMiddleware[] = [
  task,
  database,
  i18n,
  email,
  server,
];

export default systemMiddlewares;
