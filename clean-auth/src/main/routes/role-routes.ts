import { Router } from "express";

import { adaptRoute, expressMiddlewareAdapter } from "@/infra/express/adapters";
import { makeCreateRoleController } from "@/main/factories/application/controllers";
import { makeAuthMiddleware } from "@/main/factories/application/middlewares";

export default (router: Router) => {
  router.post(
    "/roles",
    // expressMiddlewareAdapter(makeAuthMiddleware()),
    adaptRoute(makeCreateRoleController())
  );
};
