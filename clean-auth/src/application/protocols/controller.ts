import { HttpRequest, HttpResponse } from "@/application/helpers";

export interface Controller {
  handle: (input: HttpRequest) => Promise<HttpResponse>;
}
