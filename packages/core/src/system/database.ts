import mysql from 'mysql';
import config from '../config';
import bus from './bus';
import { EventType } from './events';
import logging from './logging';

const logger = logging.getLogger('database');

class BlogNodeDatabase {
  private pool: mysql.Pool;

  constructor(cfg: mysql.ConnectionConfig) {
    this.pool = mysql.createPool(cfg);
  }

  getConnection() {
    return new Promise<mysql.PoolConnection>(
      (resolve, reject) => this.pool.getConnection((err, conn) => {
        if (err) reject(err);
        resolve(conn);
      }),
    );
  }
}

const db: BlogNodeDatabase = new BlogNodeDatabase({
  host: config.dbConfig.host,
  port: config.dbConfig.port,
  user: config.dbConfig.userName,
  password: config.dbConfig.password,
  database: config.dbConfig.dbName,
});

bus.once(EventType.BeforeSystemStart, () => {
  logger.info('Database connecting...');
});

export default {
  db,
};
