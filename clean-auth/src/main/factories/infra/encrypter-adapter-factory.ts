import { Encrypter } from "@/data/gateways";
import { BcryptAdapter } from "@/infra";

export const makeEncrypterAdapter = (): Encrypter => {
  return new BcryptAdapter();
};
