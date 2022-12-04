import { Controller } from "./controller";
import { SignUp } from "@/domain/features";
import { EmailInUseError, RequiredFieldError } from "@/application/errors";
import {
  badRequest,
  created,
  HttpRequest,
  HttpResponse,
  serverError,
} from "@/application/helpers";
import { GetUserByEmailRepository } from "@/data/gateways";
import { EmailValidator, RequiredStringValidator } from "@/application/validation";

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
      const error = await this.validate({ body });
      if (error) {
        return error;
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

  private async validate({ body }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const requiredFields = ["name", "email", "password"];

    for (const field of requiredFields) {
      const requiredStringValidator = new RequiredStringValidator(body?.[field], RequiredFieldsInPortuguese[field as keyof typeof RequiredFieldsInPortuguese]);
      const stringValidatorError = requiredStringValidator.validate();
      if (stringValidatorError) return badRequest(stringValidatorError);
    }

    const emailValidator = new EmailValidator(this.usersRepo, body?.email);
    const emailValidatorError = await emailValidator.validate();
    if (emailValidatorError) return badRequest(emailValidatorError);
  }
}
