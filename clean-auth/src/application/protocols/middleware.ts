import { HttpResponse } from "@/application/helpers";

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>;
}
