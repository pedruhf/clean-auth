import { Controller } from "@/application/protocols";
import { Login } from "@/domain/features";
import {
  badRequest,
  HttpRequest,
  HttpResponse,
  serverError,
  success,
} from "@/application/helpers";
import { InvalidCredentialsError } from "@/application/errors";
import { GetUserByEmailRepo } from "@/data/repos";
import { EmailExistsValidator, ValidatonBuilder } from "@/application/validation";

export class LoginController implements Controller {
  constructor(
    private readonly remoteLogin: Login,
    private readonly userRepo: GetUserByEmailRepo
  ) {}

  async handle({ body }: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validate({ body });
      if (error) {
        return badRequest(error);
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

  private async validate({ body }: HttpRequest): Promise<Error | undefined> {
    const validators = [
      ...ValidatonBuilder.of({ value: body?.email, fieldName: "e-mail" }).required().build(),
      ...ValidatonBuilder.of({ value: body?.password, fieldName: "senha" }).required().build(),
    ];

    for (const validator of validators) {
      const error = await validator.validate();
      if (error) return error;
    }

    const emailExistsValidator = new EmailExistsValidator(this.userRepo, body?.email);
    const emailExistsValidatorError = await emailExistsValidator.validate();
    if (emailExistsValidatorError) return new InvalidCredentialsError();
  }
}
