import { User } from '../../../interface/entities/user';
import { QuerySqlStatement } from '../querySqlStatement';
import { ISqlArguments, ISqlArgList } from '../sqlStatement';
import user from './user';

interface IGetAllUserArgument extends ISqlArguments {
  limit: number;
}

// eslint-disable-next-line import/prefer-default-export
export class GetAllUserStatement extends QuerySqlStatement<
User,
IGetAllUserArgument
> {
  // eslint-disable-next-line class-methods-use-this
  protected getArgList(): ISqlArgList<IGetAllUserArgument> {
    return ['limit'];
  }

  constructor() {
    super('SELECT * FROM user LIMIT ?', user.userMapper);
  }
}
