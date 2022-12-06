import { describe, it, Mock, SpyInstance } from "vitest";
import { mockReq, mockRes } from "sinon-express-mock";

import { adaptRoute } from "@/infra/express/adapters";
import { Controller } from "@/application/controllers";
import { HttpResponse, HttpStatusCode, serverError } from "@/application/helpers";
import { Request, Response } from "express";

class ControllerStub implements Controller {
  async handle(httpRequest: any): Promise<HttpResponse<any>> {
    return Promise.resolve({
      statusCode: HttpStatusCode.ok,
      data: { anyData: "any_data" },
    });
  }
}

const makeSut = () => {
  const controllerStub = new ControllerStub();
  const sut = adaptRoute(controllerStub);

  return { sut, controllerStub };
};

describe("ExpressRouterAdapter", () => {
  let req: Request;
  let res: Response;
  let statusSpy: SpyInstance;
  let jsonSpy: SpyInstance;

  beforeAll(() => {
    req = mockReq({
      body: "any_body",
      headers: "any_headers",
      params: "any_params",
      query: "any_query"
    });
    res = mockRes();
  });

  beforeEach(() => {
    statusSpy = vi.spyOn(res, "status");
    jsonSpy = vi.spyOn(res, "json");
  });

  it("should call handle with correct input", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = vi.spyOn(controllerStub, "handle");

    await sut(req, res);

    expect(handleSpy).toHaveBeenCalledTimes(1);
    expect(handleSpy).toHaveBeenCalledWith({
      body: "any_body",
      headers: "any_headers",
      params: "any_params",
      query: "any_query"
    });
  });

  it("should respond with correct statusCode and error on failure", async () => {
    const { sut, controllerStub } = makeSut();
    vi.spyOn(controllerStub, "handle").mockResolvedValueOnce(serverError(new Error("any_error")));

    await sut(req, res);

    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledTimes(1);
    expect(jsonSpy).toHaveBeenCalledWith({ error: "any_error" });
  });

  it("should respond with correct statusCode and data on success", async () => {
    const { sut } = makeSut();

    await sut(req, res);

    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledTimes(1);
    expect(jsonSpy).toHaveBeenCalledWith({ anyData: "any_data" });
  });
});
