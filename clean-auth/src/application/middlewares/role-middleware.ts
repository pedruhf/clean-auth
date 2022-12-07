import { forbidden, HttpResponse, success, unauthorized } from "@/application/helpers";
import { Middleware } from "@/application/protocols";
import { AccessDeniedError } from "@/application/errors";
import { GetUserById } from "@/data/repos";
import { Role } from "@/domain/models";

type RoleMiddlewareRequest = { userId: string };
type RoleMiddlewareResponse = HttpResponse<{ userRole: Role } | Error>;

export class RoleMiddleware implements Middleware {
  constructor(
    private readonly allowedRoles: string[],
    private readonly userRepo: GetUserById
    ) {}

  async handle(httpRequest: RoleMiddlewareRequest): Promise<RoleMiddlewareResponse> {
    try {
      const { userId } = httpRequest;
      if (!userId || !Number(userId)) {
        return forbidden(new AccessDeniedError());
      }

      const user = await this.userRepo.getById(Number(userId));
      if (!user) {
        return forbidden(new AccessDeniedError());
      }

      if (!this.allowedRoles.includes(user.role.name)) {
        return forbidden(new AccessDeniedError());
      }

      return success({ userRole: user.role });
    } catch (error) {
      return forbidden(new AccessDeniedError());
    }
  }
}
