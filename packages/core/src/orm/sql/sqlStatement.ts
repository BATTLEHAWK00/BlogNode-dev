import { MysqlError } from 'mysql';
import database from '../../system/database';
import logging from '../../system/logging';

export const logger = logging.getLogger('SqlExecutor');

export interface ISqlArguments {}

export interface ISqlArgList<T extends ISqlArguments> extends Array<keyof T> {}

export abstract class SqlStatement<T extends ISqlArguments> {
  private sql: string;

  private argList: ISqlArgList<T>;

  constructor(sql: string) {
    this.sql = sql;
    this.argList = this.getArgList();
  }

  protected abstract getArgList(): ISqlArgList<T>;

  protected setSql(sql: string) {
    this.sql = sql;
  }

  protected buildArgs(args: T) {
    return this.argList.map((key) => args[key]);
  }

  build(args: T) {
    const that = this;
    const sqlArgs = this.buildArgs(args);
    return {
      execute() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<any[]>(async (resolve, reject) => {
          const conn = await database.db.getConnection();
          conn.query(
            that.sql,
            sqlArgs,
            (err: MysqlError | null, res: any[]) => {
              if (err) reject(err);
              resolve(res);
            },
          );
        });
      },
    };
  }
}
