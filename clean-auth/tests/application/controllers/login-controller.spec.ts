import { describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";

import { Login } from "@/domain/features";
import { InvalidCredentialsError, RequiredFieldError } from "@/application/errors";
import { LoginController } from "@/application/controllers";
import { HttpRequest, HttpStatusCode } from "@/application/helpers";
import { GetUserByEmailRepo } from "@/data/repos";
import { User } from "@/domain/models";
import { getUserMock } from "@/tests/domain/mocks";

class RemoteLoginStub implements Login {
  async execute(input: Login.Input): Promise<Login.Output> {
    return {
      accessToken: "accessToken",
    };
  }
}

class UserRepoStub implements GetUserByEmailRepo {
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(getUserMock());
  }
}

const makeSut = () => {
  const remoteLoginStub = new RemoteLoginStub();
  const userRepo = new UserRepoStub();
  const sut = new LoginController(remoteLoginStub, userRepo);
  return { sut, remoteLoginStub, userRepo };
};

describe("Login Controller", () => {
  let mockedRequest: HttpRequest;

  beforeAll(() => {
    mockedRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
  })

  it("should return statusCode 400 and RequiredFieldError if email is not provided", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("e-mail"),
    });
  });

  it("should return statusCode 400 and RequiredFieldError if password is not provided", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("senha"),
    });
  });

  it("should return statusCode 400 and InvalidCredentialsError if not found user", async () => {
    const { sut, userRepo } = makeSut();
    vi.spyOn(userRepo, "getUserByEmail").mockResolvedValueOnce(undefined);

    const result = await sut.handle(mockedRequest);

    expect(result).toEqual({
      statusCode: 400,
      data: new InvalidCredentialsError(),
    });
  });

  it("should call RemoteLogin with correct input", async () => {
    const { sut, remoteLoginStub } = makeSut();
    const remoteLoginSpy = vi.spyOn(remoteLoginStub, "execute")

    await sut.handle(mockedRequest);

    expect(remoteLoginSpy).toHaveBeenCalledTimes(1);
    expect(remoteLoginSpy).toHaveBeenCalledWith(mockedRequest.body);
  });

  it("should return InvalidCredentialsError if RemoteLogin returns falsy", async () => {
    const { sut, remoteLoginStub } = makeSut();
    vi.spyOn(remoteLoginStub, "execute").mockImplementationOnce(() => Promise.resolve(undefined));

    const result = await sut.handle(mockedRequest);

    expect(result).toEqual({
      statusCode: 400,
      data: new InvalidCredentialsError()
    });
  });

  it("should status 200 and accessToken on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(mockedRequest);

    expect(result).toEqual({
      statusCode: HttpStatusCode.ok,
      data: {
        accessToken: "accessToken"
      }
    });
  });

  it("should rethrow if GetUserByEmail throws", async () => {
    const { sut, userRepo } = makeSut();
    vi.spyOn(userRepo, "getUserByEmail").mockRejectedValueOnce(new Error("getUserByEmail error"));

    const result = await sut.handle(mockedRequest);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("getUserByEmail error")
    });
  });

  it("should rethrow if RemoteLogin throws", async () => {
    const { sut, remoteLoginStub } = makeSut();
    vi.spyOn(remoteLoginStub, "execute").mockRejectedValueOnce(new Error("remoteLogin error"));

    const result = await sut.handle(mockedRequest);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("remoteLogin error")
    });
  });
});
