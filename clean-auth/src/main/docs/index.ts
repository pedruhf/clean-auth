import { loginPath, signUpPath } from "./paths/auth";
import { userSchema } from "./schemas/user";

export default {
  "openapi": "3.0.0",
  "info": {
    "title": "API de autenticação",
    "description": "Serviço desenvolvido por Pedro Freitas",
    "contact": "pedroh.ufrn@gmail.com"
  },
  "version": "1.0.0",
  servers: [{
    url: "/api"
  }],
  tags: [{
    name: "Autenticação"
  }],
  paths: {
    "/sign-up": signUpPath,
    "/login": loginPath,
  },
  schemas: {
    user: userSchema,
  }
}
