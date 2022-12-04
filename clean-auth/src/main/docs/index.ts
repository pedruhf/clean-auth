import { loginPath, signUpPath } from "./paths/auth";
import { userSchema } from "./schemas/user";
import { auth } from "./schemas/auth";
import { abcPath } from "./paths/abc";

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
  tags: [
    { name: "Autenticação" },
    { name: "Testes" }
  ],
  paths: {
    "/sign-up": signUpPath,
    "/login": loginPath,
    "/abc": abcPath,
  },
  schemas: {
    user: userSchema,
    auth: auth
  },
  components: {
    securitySchemes: {
      auth,
    }
  }
};
