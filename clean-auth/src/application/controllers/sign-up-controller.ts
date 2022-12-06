import { Controller } from "@/application/protocols";
import { SignUp } from "@/domain/features";
import {
  badRequest,
  created,
  HttpRequest,
  HttpResponse,
  serverError,
} from "@/application/helpers";
import { GetUserByEmailRepo } from "@/data/repos";
import { EmailInUseValidator, ValidatonBuilder } from "@/application/validation";

export class SignUpController implements Controller {
  constructor(
    private readonly userRepo: GetUserByEmailRepo,
    private readonly signUp: SignUp
  ) {}

  async handle({ body }: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validate({ body });
      if (error) {
        return badRequest(error);
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

  private async validate({ body }: HttpRequest): Promise<Error | undefined> {
    const validators = [
      ...ValidatonBuilder.of({ value: body?.name, fieldName: "nome" }).required().minLength(3).build(),
      ...ValidatonBuilder.of({ value: body?.email, fieldName: "e-mail" }).required().email().build(),
      ...ValidatonBuilder.of({ value: body?.password, fieldName: "senha" }).required().minLength(8).build(),
    ];

    for (const validator of validators) {
      const error = await validator.validate();
      if (error) return error;
    }

    const emailInUseValidator = new EmailInUseValidator(this.userRepo, body?.email);
    const emailInUseValidatorError = await emailInUseValidator.validate();
    if (emailInUseValidatorError) return emailInUseValidatorError;
  }
}
