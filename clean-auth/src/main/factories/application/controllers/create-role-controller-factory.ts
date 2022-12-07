import { CreateRoleController } from "@/application/controllers";
import { Controller } from "@/application/protocols";
import { makeDbCreateRole } from "@/main/factories/data";
import { makeRoleRepo } from "@/main/factories/infra";

export const makeCreateRoleController = (): Controller => {
  const roleRepo = makeRoleRepo();
  const createRole = makeDbCreateRole();
  return new CreateRoleController(createRole, roleRepo);
};
