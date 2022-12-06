import { DbGetUsers } from "@/data/use-cases";
import { GetUsers } from "@/domain/features";
import { makeUserRepo } from "@/main/factories/infra";

export const makeDbGetUsers = (): GetUsers => {
  const userRepo = makeUserRepo();
  return new DbGetUsers(userRepo);
}
