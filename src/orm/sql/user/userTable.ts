import { ISqlArgList, ISqlArguments, SqlStatement } from "../sqlStatement";

`
id: number;
username: string;
nickname: string;
gender: Gender;
bio: string;
email: string;
phone: string;
website: string;
passwordHash: string;
passwordSalt: string;
registerTime: Date;
lastLogin: Date;
registerIp: string;
loginIp: string;`;

const createTableSql = `
CREATE TABLE user(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64),
    nickname VARCHAR(64),
    gender VARCHAR(10),
    bio VARCHAR(255),
    email VARCHAR(64),
    phone VARCHAR(32),
    website VARCHAR(64),
    password_hash VARCHAR(256),
    password_salt VARCHAR(64),
    register_time DATETIME,
    last_login DATETIME,
    register_ip varchar(64),
    login_ip varchar(64)
)
`;

class CreateUserTableStatement extends SqlStatement<ISqlArguments> {
  protected getArgList(): ISqlArgList<ISqlArguments> {
    return [];
  }
  constructor() {
    super(createTableSql);
  }
}

export default {
  CreateUserTableStatement,
};
