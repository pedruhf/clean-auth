import { RoleRepo } from "@/data/repos";
import { PgRoleRepo } from "@/infra/database/repos";

export const makeRoleRepo = (): RoleRepo => {
  return PgRoleRepo.getInstance();
}
