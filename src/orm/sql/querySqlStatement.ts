import { Timer } from '../../util/utils';
import { ISqlArguments, logger, SqlStatement } from './sqlStatement';

export interface EntityMapper {
  [name: string]: string;
}

export abstract class QuerySqlStatement<
    K,
    T extends ISqlArguments,
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
        // eslint-disable-next-line no-param-reassign
        if (this.entityMapper[row[0]]) row[0] = this.entityMapper[row[0]];
        return row;
      }),
    );
  }

  async getOne(args: T): Promise<K> {
    const res = await this.build(args).execute();
    return this.processMapping(res[0]);
  }

  async getMany(args: T, limit: number = -1): Promise<K[]> {
    this.queryTimer.start();
    const res = await this.build(args).execute();
    let limitedRes: any[];
    if (limit === -1) limitedRes = res;
    else limitedRes = res.slice(0, limit - 1);
    const finalRes = await Promise.all(
      limitedRes.map(async (data) => this.processMapping(data)),
    );
    this.queryTimer.end();
    logger.debug(`Sql execute done. time: ${this.queryTimer.result()}ms`);
    return finalRes;
  }
}
