import { SignUpController } from "@/application/controllers";
import { Controller } from "@/application/protocols";
import { makeRemoteSignUp } from "@/main/factories/data";
import { makeRoleRepo, makeUserRepo } from "@/main/factories/infra";

export const makeSignUpController = (): Controller => {
  const userRepo = makeUserRepo();
  const roleRepo = makeRoleRepo();
  const remoteSignUp = makeRemoteSignUp();
  return new SignUpController(userRepo, roleRepo, remoteSignUp);
};
