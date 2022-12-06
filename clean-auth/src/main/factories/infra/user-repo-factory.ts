import { UserRepo } from "@/data/repos";
import { PgUserRepo } from "@/infra/database/repos";

export const makeUserRepo = (): UserRepo => {
  return PgUserRepo.getInstance();
}
