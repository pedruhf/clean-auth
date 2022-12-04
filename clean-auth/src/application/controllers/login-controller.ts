import { Controller } from "./controller";
import { Login } from "@/domain/features";
import {
  badRequest,
  HttpRequest,
  HttpResponse,
  serverError,
  success,
} from "@/application/helpers";
import { InvalidCredentialsError } from "@/application/errors";
import { GetUserByEmailRepository } from "@/data/gateways";
import { GetEmailValidator, RequiredStringValidator } from "@/application/validation";

enum RequiredFieldsInPortuguese {
  email = "e-mail",
  password = "senha",
}

export class LoginController implements Controller {
  constructor(
    private readonly remoteLogin: Login,
    private readonly userRepo: GetUserByEmailRepository
  ) {}

  async handle({ body }: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validate({ body });
      if (error) {
        return error;
      }

      const result = await this.remoteLogin.execute({
        email: body?.email,
        password: body?.password,
      });
      if (!result?.accessToken) {
        return badRequest(new InvalidCredentialsError());
      }

      return success(result);
    } catch (error) {
      return serverError(<Error>error);
    }
  }

  private async validate({
    body,
  }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      const requiredStringValidator = new RequiredStringValidator(body?.[field], RequiredFieldsInPortuguese[field as keyof typeof RequiredFieldsInPortuguese]);
      const stringValidatorError = requiredStringValidator.validate();
      if (stringValidatorError) return badRequest(stringValidatorError);
    }

    const getEmailValidator = new GetEmailValidator(this.userRepo, body?.email);
    const getEmailValidatorError = await getEmailValidator.validate();
    if (getEmailValidatorError) return badRequest(new InvalidCredentialsError());
  }
}
