import { User } from '@src/interface/entities/user';
import { QuerySqlStatement } from '../querySqlStatement';
import { ISqlArgList, ISqlArguments } from '../sqlStatement';
import user from './user';

interface IGetUserByIdArgs extends ISqlArguments {
  idList: number[];
}

// eslint-disable-next-line import/prefer-default-export
export class GetUserByIdStatement extends QuerySqlStatement<
User,
IGetUserByIdArgs
> {
  // eslint-disable-next-line class-methods-use-this
  protected getArgList(): ISqlArgList<IGetUserByIdArgs> {
    return ['idList'];
  }

  constructor() {
    super('SELECT * FROM user WHERE user_id IN(?)', user.userMapper);
  }
}
