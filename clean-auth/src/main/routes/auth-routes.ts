import { Router } from "express";

import { adaptRoute } from "@/infra/express/adapters";
import { makeLoginController, makeSignUpController } from "@/main/factories/application/controllers";

export default (router: Router) => {
  router.post("/sign-up", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
