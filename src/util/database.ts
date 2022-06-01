import mysql from "mysql";

export class BlogNodeDatabase {
  pool: mysql.Pool;

  constructor(config: mysql.ConnectionConfig) {
    this.pool = mysql.createPool(config);
  }
}
