import { hashSync } from "bcrypt";

import { Encrypter } from "@/data/gateways";

export class BcryptAdapter implements Encrypter {
  public static salt = 10;

  encrypt(value: string): string {
    const hashedValue = hashSync(value, BcryptAdapter.salt);
    return hashedValue;
  }
}
