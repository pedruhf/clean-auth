import {
  HttpResponse,
  serverError,
  success,
  unauthorized,
} from "@/application/helpers";
import { Middleware } from "@/application/protocols";
import { Decrypter } from "@/data/gateways";
import { AccessDeniedError } from "@/application/errors";

type AuthMiddlewareRequest = {
  accessToken?: string;
};

type AuthMiddlewareResponse = HttpResponse<{ userId: string } | Error>;

export class AuthMiddleware implements Middleware {
  constructor(private readonly decrypter: Decrypter) {}

  async handle(
    httpRequest: AuthMiddlewareRequest
  ): Promise<AuthMiddlewareResponse> {
    try {
      const { accessToken } = httpRequest;
      if (!accessToken) {
        return unauthorized(new AccessDeniedError());
      }

      const userId = this.decrypter.decrypt(accessToken);
      return success({ userId });
    } catch (error) {
      return serverError(<Error>error);
    }
  }
}
