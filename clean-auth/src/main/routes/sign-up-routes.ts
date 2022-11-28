import { Router } from "express";

import { adaptRoute } from "@/infra/express/adapters";
import { makeSignUpController } from "@/main/factories/application";

export default (router: Router) => {
  router.post("/sign-up", adaptRoute(makeSignUpController()));
};
