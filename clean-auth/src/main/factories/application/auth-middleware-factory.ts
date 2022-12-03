import { AuthMiddleware } from "@/application/middlewares";
import { Middleware } from "@/application/protocols";
import { makeJwtAdapter } from "@/main/factories/infra";

export const makeAuthMiddleware = (): Middleware => {
  const token = makeJwtAdapter();
  return new AuthMiddleware(token);
}
