import { User } from "@src/interface/entities/user";
import { ISqlArgList, ISqlArguments, QuerySqlStatement } from "../sqlStatement";
import user from "./user";

interface IGetUserByIdArgs extends ISqlArguments {
  idList: number[];
}

export class GetUserByIdStatement extends QuerySqlStatement<
  User,
  IGetUserByIdArgs
> {
  protected getArgList(): ISqlArgList<IGetUserByIdArgs> {
    return ["idList"];
  }
  constructor() {
    super("SELECT * FROM user WHERE user_id IN(?)", user.userMapper);
  }
}
