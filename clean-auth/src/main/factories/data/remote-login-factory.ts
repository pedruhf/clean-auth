import { RemoteLogin } from "@/data/use-cases";
import { Login } from "@/domain/features";
import { makeEncrypterAdapter, makeJwtAdapter, makeUserRepo } from "@/main/factories/infra";

export const makeRemoteLogin = (): Login => {
  const userRepo = makeUserRepo();
  const encrypterComparer = makeEncrypterAdapter();
  const JwtAdapter = makeJwtAdapter();
  return new RemoteLogin(userRepo, encrypterComparer, JwtAdapter);
}
