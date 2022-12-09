import { Router } from "express";

import { adaptRoute, expressMiddlewareAdapter } from "@/infra/express/adapters";
import { makeCreateRoleController } from "@/main/factories/application/controllers";
import { makeAuthMiddleware, makeRoleMiddleware } from "@/main/factories/application/middlewares";
import { Roles } from "@/domain/models";

export default (router: Router) => {
  router.post(
    "/roles",
    expressMiddlewareAdapter(makeAuthMiddleware()),
    expressMiddlewareAdapter(makeRoleMiddleware([Roles.admin, Roles.developer])),
    adaptRoute(makeCreateRoleController())
  );
};
