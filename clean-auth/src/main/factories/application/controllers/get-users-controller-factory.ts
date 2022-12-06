import { GetUsersController } from "@/application/controllers";
import { Controller } from "@/application/protocols";
import { makeDbGetUsers } from "@/main/factories/data";

export const makeGetUsersController = (): Controller => {
  const dbGetUsers = makeDbGetUsers();
  return new GetUsersController(dbGetUsers);
};
