export enum HttpStatusCode {
  ok = 200,
  created = 201,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  serverError = 500,
}

export type HttpRequest = {
  body?: Record<string, any>
  headers?: Record<string, any>
  params?: Record<string, any>
  query?: Record<string, any>
};

export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode;
  data?: T;
};

export const success = <T>(data?: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.ok,
  data: data,
});

export const created = <T>(data?: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.created,
  data: data,
});

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.badRequest,
  data: error,
});

export const unauthorized = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.unauthorized,
  data: error,
});

export const forbidden = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.forbidden,
  data: error,
});

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.serverError,
  data: error,
});
