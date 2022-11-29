import { TokenGenerator } from "@/data/gateways";
import { JwtAdapter } from "@/infra";

export const makeJwtAdapter = (): TokenGenerator => {
  return new JwtAdapter();
};
