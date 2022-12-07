import { Controller } from "@/application/protocols";
import {
  badRequest,
  created,
  HttpRequest,
  HttpResponse,
  serverError,
} from "@/application/helpers";
import { GetRoleByNameRepo } from "@/data/repos";
import { CreateRole } from "@/domain/features";
import { ValidatonBuilder } from "@/application/validation";

export class CreateRoleController implements Controller {
  constructor(
    private readonly createRole: CreateRole,
    private readonly roleRepo: GetRoleByNameRepo
  ) {}

  async handle({ body }: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validate({ body });
      if (error) {
        return badRequest(error);
      }

      await this.createRole.execute({
        name: body?.name,
        permissions: body?.permissions
      });
      return created();
    } catch (error) {
      return serverError(<Error>error);
    }
  }

  private async validate({ body }: HttpRequest): Promise<Error | undefined> {
    const validators = [
      ...ValidatonBuilder.of({ value: body?.name, fieldName: "nome" }).required().minLength(3).build(),
      ...ValidatonBuilder.of({ value: body?.permissions, fieldName: "permissões" }).required().build(),
    ];

    for (const validator of validators) {
      const error = await validator.validate();
      if (error) return error;
    }
  }
}
