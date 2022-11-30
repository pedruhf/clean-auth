import { Controller, SignUpController } from "@/application/controllers";
import { makeRemoteSignUp } from "@/main/factories/data";
import { makeUserRepo } from "@/main/factories/infra";

export const makeSignUpController = (): Controller => {
  const userRepo = makeUserRepo();
  const remoteSignUp = makeRemoteSignUp();
  return new SignUpController(userRepo, remoteSignUp);
};
