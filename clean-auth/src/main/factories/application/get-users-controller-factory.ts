import { Controller, GetUsersController } from "@/application/controllers";
import { makeDbGetUsers } from "@/main/factories/data";

export const makeGetUsersController = (): Controller => {
  const dbGetUsers = makeDbGetUsers();
  return new GetUsersController(dbGetUsers);
};
