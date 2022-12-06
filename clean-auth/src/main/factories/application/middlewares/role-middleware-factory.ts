import { RoleMiddleware } from "@/application/middlewares";
import { Middleware } from "@/application/protocols";
import { makeUserRepo } from "@/main/factories/infra";

export const makeRoleMiddleware = (allowedRoutes: string[]): Middleware => {
  const userRepo = makeUserRepo();
  return new RoleMiddleware(allowedRoutes, userRepo);
}
