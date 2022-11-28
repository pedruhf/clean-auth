import { UserRepo } from "@/data/gateways";
import { PgUserRepo } from "@/infra/database";

export const makeUserRepo = (): UserRepo => {
  return PgUserRepo.getInstance();
}
