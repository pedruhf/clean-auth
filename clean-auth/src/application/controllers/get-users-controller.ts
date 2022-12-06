import { Controller } from "@/application/protocols";
import { HttpRequest, HttpResponse, serverError, success } from "@/application/helpers";
import { GetUsers } from "@/domain/features";
import { User } from "@/domain/models";

export class GetUsersController implements Controller {
  constructor(private readonly dbGetUsers: GetUsers) {}

  async handle ({ query }: HttpRequest): Promise<HttpResponse<any>> {
    try {
      let result: User[];

      if (Number(query?.page) && Number(query?.limit)) {
        result = await this.dbGetUsers.execute({ page: Number(query?.page), limit: Number(query?.limit) });
      } else {
        const defaultParams = { page: 1, limit: 20 };
        result = await this.dbGetUsers.execute(defaultParams);
      }
      return success(result);
    } catch (error) {
      return serverError(<Error>error);
    }
  }
}
