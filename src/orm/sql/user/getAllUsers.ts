import { User } from "../../../interface/entities/user";
import { ISqlArguments, ISqlArgList, QuerySqlStatement } from "../sqlStatement";
import user from "./user";

interface IGetAllUserArgument extends ISqlArguments {
  limit: number;
}

export class GetAllUserStatement extends QuerySqlStatement<
  User,
  IGetAllUserArgument
> {
  protected getArgList(): ISqlArgList<IGetAllUserArgument> {
    return ["limit"];
  }

  constructor() {
    super("SELECT * FROM user LIMIT ?", user.userMapper);
  }
}
