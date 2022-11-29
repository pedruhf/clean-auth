import { EncryptComparer, Encrypter } from "@/data/gateways";
import { BcryptAdapter } from "@/infra";

export const makeEncrypterAdapter = (): Encrypter & EncryptComparer => {
  return new BcryptAdapter();
};
