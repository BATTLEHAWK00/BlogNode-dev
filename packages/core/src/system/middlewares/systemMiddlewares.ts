import { SystemMiddleware } from '../middleware';
import database from './system/database';
import server from './system/server';
import task from './system/task';

const systemMiddlewares:SystemMiddleware[] = [
  task,
  database,
  server,
];

export default systemMiddlewares;
