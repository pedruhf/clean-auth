import { hashSync, compareSync } from "bcrypt";

import { EncryptComparer, Encrypter } from "@/data/gateways";

export class BcryptAdapter implements Encrypter, EncryptComparer {
  public static salt = 10;

  encrypt(value: string): string {
    const hashedValue = hashSync(value, BcryptAdapter.salt);
    return hashedValue;
  }

  compare (encryptedValue: string, value: string): boolean {
    const matchValues = compareSync(value, encryptedValue);
    return matchValues;
  }
}
