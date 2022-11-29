import { sign } from "jsonwebtoken";

import { TokenGenerator } from "@/data/gateways";

export class JwtAdapter implements TokenGenerator {
  static expiresTimeInMs = 3 * 60 * 60 * 1000;

  generate(id: number): string {
    const token = sign({ id }, "any_secret", { expiresIn: JwtAdapter.expiresTimeInMs });
    return token;
  }
}
