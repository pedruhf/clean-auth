import { Controller, LoginController } from "@/application/controllers";
import { makeRemoteLogin } from "@/main/factories/data";
import { makeUserRepo } from "../infra";

export const makeLoginController = (): Controller => {
  const remoteLogin = makeRemoteLogin();
  const userRepo = makeUserRepo();
  return new LoginController(remoteLogin, userRepo);
};
