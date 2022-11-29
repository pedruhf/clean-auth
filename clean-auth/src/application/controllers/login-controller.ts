import { Controller } from "./controller";
import { Login } from "@/domain/features";
import { badRequest, HttpRequest, serverError, success } from "@/application/helpers";
import { InvalidCredentialsError, RequiredFieldError } from "@/domain/errors";
import { GetUserByEmailRepository } from "@/data/gateways";

enum RequiredFieldsInPortuguese {
  email = "e-mail",
  password = "senha",
}

export class LoginController implements Controller {
  constructor(
    private readonly remoteLogin: Login,
    private readonly userRepo: GetUserByEmailRepository
  ) {}

  async handle({ body }: HttpRequest): Promise<any> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(
            new RequiredFieldError(RequiredFieldsInPortuguese[field])
          );
        }
      }

      const user = await this.userRepo.getUserByEmail(body.email);
      if (!user) {
        return badRequest(new InvalidCredentialsError());
      }

      const result = await this.remoteLogin.execute({
        email: body.email,
        password: body.password,
      });
      if (!result?.accessToken) {
        return badRequest(new InvalidCredentialsError());
      }

      return success(result);
    } catch (error) {
      return serverError(error);
    }
  }
}