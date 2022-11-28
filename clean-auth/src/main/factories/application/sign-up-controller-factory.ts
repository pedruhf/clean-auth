import { Controller, SignUpController } from "@/application/controllers";
import { makeRemoteSignUp } from "../data";

export const makeSignUpController = (): Controller => {
  const remoteSignUp = makeRemoteSignUp();
  return new SignUpController(remoteSignUp);
};
