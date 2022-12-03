import {
  HttpResponse,
  serverError,
  success,
  unauthorized,
} from "@/application/helpers";
import { Middleware } from "@/application/protocols";
import { TokenDecrypter } from "@/data/gateways";
import { UnauthorizedError } from "@/application/errors";

type AuthMiddlewareRequest = {
  authorization?: string;
};

type AuthMiddlewareResponse = HttpResponse<{ userId: string } | Error>;

export class AuthMiddleware implements Middleware {
  constructor(private readonly token: TokenDecrypter) {}

  async handle(
    httpRequest: AuthMiddlewareRequest
  ): Promise<AuthMiddlewareResponse> {
    try {
      const { authorization } = httpRequest;
      if (!authorization) {
        return unauthorized(new UnauthorizedError());
      }

      const userId = this.token.decrypt(authorization);
      return success({ userId });
    } catch (error) {
      return unauthorized(new UnauthorizedError());
    }
  }
}
