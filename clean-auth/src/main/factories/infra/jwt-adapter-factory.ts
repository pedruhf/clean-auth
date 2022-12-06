import { TokenDecrypter, TokenGenerator } from "@/data/gateways";
import { JwtAdapter } from "@/infra/adapters";

export const makeJwtAdapter = (): TokenGenerator & TokenDecrypter => {
  return new JwtAdapter();
};
