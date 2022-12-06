import { LoginController } from "@/application/controllers";
import { Controller } from "@/application/protocols";
import { makeRemoteLogin } from "@/main/factories/data";
import { makeUserRepo } from "@/main/factories/infra";

export const makeLoginController = (): Controller => {
  const remoteLogin = makeRemoteLogin();
  const userRepo = makeUserRepo();
  return new LoginController(remoteLogin, userRepo);
};
