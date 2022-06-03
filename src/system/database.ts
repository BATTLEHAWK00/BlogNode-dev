import { DatabaseConfig } from "@src/interface/config";
import mysql from "mysql";
import bus from "./bus";
import { EventType } from "./events";
import logging from "./logging";

const logger = logging.getLogger("database");

class BlogNodeDatabase {
  private pool: mysql.Pool;

  constructor(config: mysql.ConnectionConfig) {
    this.pool = mysql.createPool(config);
  }

  getConnection() {
    return new Promise<mysql.PoolConnection>((resolve, reject) =>
      this.pool.getConnection((err, conn) => {
        if (err) reject(err);
        resolve(conn);
      })
    );
  }
}

const dbConfig: DatabaseConfig = {
  host: "sv.battlehawk233.cn",
  port: 10036,
  userName: "root",
  password: "yxl123456.",
  dbName: "examination_system",
};

const db: BlogNodeDatabase = new BlogNodeDatabase({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.userName,
  password: dbConfig.password,
  database: dbConfig.dbName,
});

bus.once(EventType.BeforeSystemStart, () => {
  logger.info("Database connecting...");
});

export default {
  db,
};
