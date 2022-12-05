import { Controller } from "./controller";
import { HttpRequest, HttpResponse, serverError, success } from "@/application/helpers";
import { GetUsers } from "@/domain/features";
import { User } from "@/domain/models";

export class GetUsersController implements Controller {
  constructor(private readonly dbGetUsers: GetUsers) {}

  async handle ({ params }: HttpRequest): Promise<HttpResponse<any>> {
    try {
      let result: User[];

      if (Number(params?.page) && Number(params?.limit)) {
        result = await this.dbGetUsers.execute({ page: Number(params?.page), limit: Number(params?.limit) });
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
