import { Controller } from "./controller";
import { SignUp } from "@/domain/features";
import { EmailInUseError, RequiredFieldError } from "@/domain/errors";
import {
  badRequest,
  created,
  HttpRequest,
  HttpResponse,
  serverError,
} from "@/application/helpers";
import { GetUserByEmailRepository } from "@/data/gateways";

enum RequiredFieldsInPortuguese {
  name = "nome",
  email = "e-mail",
  password = "senha",
}

export class SignUpController implements Controller {
  constructor(
    private readonly usersRepo: GetUserByEmailRepository,
    private readonly signUp: SignUp
  ) {}

  async handle({ body }: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["name", "email", "password"];
      for (const field of requiredFields) {
        if (!body?.[field]) {
          return badRequest(
            new RequiredFieldError(
              RequiredFieldsInPortuguese[
                field as keyof typeof RequiredFieldsInPortuguese
              ]
            )
          );
        }
      }

      const foundedUser = await this.usersRepo.getUserByEmail(body?.email);
      if (foundedUser) {
        return badRequest(new EmailInUseError());
      }

      await this.signUp.execute({
        name: body?.name,
        email: body?.email,
        password: body?.password,
      });
      return created();
    } catch (error) {
      return serverError(<Error>error);
    }
  }
}
