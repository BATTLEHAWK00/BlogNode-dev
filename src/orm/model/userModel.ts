import { User } from "@src/interface/entities/user";
import cache from "../../system/cache";
import { GetAllUserStatement } from "../sql/user/getAllUsers";
import { GetUserByIdStatement } from "../sql/user/getUserById";

const userCache = cache.getCache<User>(500);

async function getAllUsers(): Promise<User[]> {
  const res: User[] = await new GetAllUserStatement().getMany({ limit: 5 });
  res.forEach((user) => userCache.set(`id:${user.userId}`, user));
  return res;
}

async function getUserById(ids: number[]): Promise<User[]> {
  const res: User[] = [];
  res.push(
    ...(await new GetUserByIdStatement().getMany({
      idList: ids,
    }))
  );
  res.forEach((user) => userCache.set(`id:${user.userId}`, user));
  return res;
}

export default {
  getAllUsers,
  getUserById,
};
