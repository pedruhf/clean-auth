import { sign, verify } from "jsonwebtoken";

import { TokenDecrypter, TokenGenerator } from "@/data/gateways";

export class JwtAdapter implements TokenGenerator, TokenDecrypter {
  static expiresTimeInMs = 3 * 60 * 60 * 1000;

  generate(id: number): string {
    const token = sign({ id }, "any_secret", { expiresIn: JwtAdapter.expiresTimeInMs });
    return token;
  }

  decrypt (encryptedValue: string): string {
    const decryptedValue = verify(encryptedValue, "any_secret") as string;
    return decryptedValue;
  }
}
