import { Timer } from "../../util/utils";
import { MysqlError } from "mysql";
import database from "../../system/database";
import logging from "../../system/logging";

const logger = logging.getLogger("SqlExecutor");

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
        return new Promise<any[]>(async (resolve, reject) => {
          const conn = await database.db.getConnection();
          conn.query(
            that.sql,
            sqlArgs,
            (err: MysqlError | null, res: any[]) => {
              if (err) reject(err);
              resolve(res);
            }
          );
        });
      },
    };
  }
}

export interface EntityMapper {
  [name: string]: string;
}

export abstract class QuerySqlStatement<
  K,
  T extends ISqlArguments
> extends SqlStatement<T> {
  private entityMapper: EntityMapper;
  private queryTimer: Timer = new Timer();

  constructor(sql: string, entityMapper: EntityMapper) {
    super(sql);
    this.entityMapper = entityMapper;
  }

  private processMapping(obj: Object): K {
    return <K>Object.fromEntries(
      Object.entries(obj).map((row) => {
        if (this.entityMapper[row[0]]) row[0] = this.entityMapper[row[0]];
        return row;
      })
    );
  }

  async getOne(args: T): Promise<K> {
    const res = await this.build(args).execute();
    return this.processMapping(res[0]);
  }

  async getMany(args: T, limit: number = -1): Promise<K[]> {
    let finalRes: K[];
    this.queryTimer.start();
    const res = await this.build(args).execute();
    let limitedRes: any[];
    if (limit === -1) limitedRes = res;
    else limitedRes = res.slice(0, limit - 1);
    finalRes = await Promise.all(
      limitedRes.map(async (data) => this.processMapping(data))
    );
    this.queryTimer.end();
    logger.debug(`Sql execute done. time: ${this.queryTimer.result()}ms`);
    return finalRes;
  }
}
