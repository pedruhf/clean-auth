import { Router } from "express";

import { adaptRoute, expressMiddlewareAdapter } from "@/infra/express/adapters";
import { makeAuthMiddleware, makeLoginController, makeSignUpController } from "@/main/factories/application";

export default (router: Router) => {
  router.post("/sign-up", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
  router.get("/abc", expressMiddlewareAdapter(makeAuthMiddleware()), (req, res) => {
    res.send({ message: "oi" })
  });
};
