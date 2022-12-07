import { DbCreateRole } from "@/data/use-cases/role";
import { CreateRole } from "@/domain/features";
import { makeRoleRepo } from "@/main/factories/infra";

export const makeDbCreateRole = (): CreateRole => {
  const roleRepo = makeRoleRepo();
  return new DbCreateRole(roleRepo);
};
