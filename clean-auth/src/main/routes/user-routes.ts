import { Router } from "express";

import { adaptRoute, expressMiddlewareAdapter } from "@/infra/express/adapters";
import { makeGetUsersController } from "@/main/factories/application/controllers";
import {
  makeAuthMiddleware,
  makeRoleMiddleware,
} from "@/main/factories/application/middlewares";

export default (router: Router) => {
  router.get(
    "/users",
    expressMiddlewareAdapter(makeAuthMiddleware()),
    expressMiddlewareAdapter(makeRoleMiddleware(["admin", "user"])),
    adaptRoute(makeGetUsersController())
  );
};
