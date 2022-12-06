import { EncryptComparer, Encrypter } from "@/data/gateways";
import { BcryptAdapter } from "@/infra/adapters";

export const makeEncrypterAdapter = (): Encrypter & EncryptComparer => {
  return new BcryptAdapter();
};
