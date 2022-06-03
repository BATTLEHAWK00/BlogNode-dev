import { EntityMapper } from "../sqlStatement";

const userMapper: EntityMapper = {
  user_id: "userId",
  passwd_hash: "passwordHash",
  passwd_salt: "passwordSalt",
  register_ip: "registerIp",
  login_ip: "loginIp",
  register_time: "registerTime",
  last_login: "lastLogin",
};

export default {
  userMapper,
};
