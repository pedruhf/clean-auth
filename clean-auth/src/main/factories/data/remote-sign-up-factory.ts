import { RemoteSignUp } from "@/data/use-cases/auth";
import { SignUp } from "@/domain/features";
import { makeEncrypterAdapter, makeUserRepo } from "@/main/factories/infra";

export const makeRemoteSignUp = (): SignUp => {
  const userRepo = makeUserRepo();
  const encrypter = makeEncrypterAdapter();
  return new RemoteSignUp(userRepo, encrypter);
}
