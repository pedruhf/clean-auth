import { Router } from "express";

import { adaptRoute, expressMiddlewareAdapter } from "@/infra/express/adapters";
import { makeAuthMiddleware, makeGetUsersController } from "@/main/factories/application";

export default (router: Router) => {
  router.get("/users", expressMiddlewareAdapter(makeAuthMiddleware()), adaptRoute(makeGetUsersController()));
};
