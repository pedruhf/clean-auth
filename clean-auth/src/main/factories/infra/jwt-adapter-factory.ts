import { TokenDecrypter, TokenGenerator } from "@/data/gateways";
import { JwtAdapter } from "@/infra";

export const makeJwtAdapter = (): TokenGenerator & TokenDecrypter => {
  return new JwtAdapter();
};
