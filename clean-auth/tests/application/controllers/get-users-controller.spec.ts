import { describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";

import { RequiredFieldError } from "@/application/errors";
import { GetUsersController } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";
import { GetUsers } from "@/domain/features";
import { getUserMock } from "@/tests/domain/mocks";

class GetUsersStub implements GetUsers {
  async execute (input: GetUsers.Input): Promise<GetUsers.Output> {
    return Promise.resolve([]);
  }
}

const makeSut = () => {
  const getUsersStub = new GetUsersStub()
  const sut = new GetUsersController(getUsersStub);
  return { sut, getUsersStub };
};

describe("GetUsers Controller", () => {
  let request: HttpRequest;

  beforeAll(() => {
    request = {
      params: { page: faker.datatype.number({ min: 1 }), limit: faker.datatype.number({ min: 1 }) },
    }
  })

  it("should call GetUsersRepo with correct input", async () => {
    const { sut, getUsersStub } = makeSut();
    const executeSpy = vi.spyOn(getUsersStub, "execute");

    await sut.handle(request);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(request.params);
  });

  it("should call GetUsersRepo with default input", async () => {
    const { sut, getUsersStub } = makeSut();
    const executeSpy = vi.spyOn(getUsersStub, "execute");

    await sut.handle({});

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it("should return statusCode 200 with correct data", async () => {
    const { sut, getUsersStub } = makeSut();
    const mockedResult = [getUserMock(), getUserMock()]
    vi.spyOn(getUsersStub, "execute").mockResolvedValueOnce(mockedResult);

    const result = await sut.handle({});

    expect(result).toEqual({
      statusCode: 200,
      data: mockedResult
    })
  });

  it("should return statusCode 500 with correct data if UsersRepo throws", async () => {
    const { sut, getUsersStub } = makeSut();
    vi.spyOn(getUsersStub, "execute").mockRejectedValueOnce(new Error("execute error"));

    const result = await sut.handle({});

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("execute error")
    })
  });
});
