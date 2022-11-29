import { describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";

import { Login } from "@/domain/features";
import { InvalidCredentialsError, RequiredFieldError } from "@/domain/errors";
import { LoginController } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";
import { GetUserByEmailRepository } from "@/data/gateways";
import { User } from "@/domain/models";
import { getUserMock } from "@/tests/domain/mocks";

class RemoteLoginStub implements Login {
  async execute(input: Login.Input): Promise<Login.Output> {
    return {
      accessToken: "accessToken",
    };
  }
}

class UserRepoStub implements GetUserByEmailRepository {
  async getUserByEmail(email: string): Promise<User> {
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
  it("should return RequiredFieldError if email is not provided", async () => {
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

  it("should return RequiredFieldError if password is not provided", async () => {
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

  it("should call GetUserByEmail with correct input", async () => {
    const { sut, userRepo } = makeSut();
    const getUserByEmailSpy = vi.spyOn(userRepo, "getUserByEmail");

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    await sut.handle(request);

    expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(getUserByEmailSpy).toHaveBeenCalledWith(request.body.email);
  });

  it("should return InvalidCredentialsError if not found user", async () => {
    const { sut, userRepo } = makeSut();
    vi.spyOn(userRepo, "getUserByEmail").mockResolvedValueOnce(undefined);

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new InvalidCredentialsError(),
    });
  });

  it("should call RemoteLogin with correct input", async () => {
    const { sut, remoteLoginStub } = makeSut();
    const remoteLoginSpy = vi.spyOn(remoteLoginStub, "execute")

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    await sut.handle(request);

    expect(remoteLoginSpy).toHaveBeenCalledTimes(1);
    expect(remoteLoginSpy).toHaveBeenCalledWith(request.body);
  });

  it("should return InvalidCredentialsError if RemoteLogin returns falsy", async () => {
    const { sut, remoteLoginStub } = makeSut();
    vi.spyOn(remoteLoginStub, "execute").mockReturnValueOnce(undefined);

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new InvalidCredentialsError()
    });
  });

  it("should status 200 and accessToken on success", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 200,
      data: {
        accessToken: "accessToken"
      }
    });
  });

  it("should rethrow if GetUserByEmail throws", async () => {
    const { sut, userRepo } = makeSut();
    vi.spyOn(userRepo, "getUserByEmail").mockRejectedValueOnce(new Error("getUserByEmail error"));

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("getUserByEmail error")
    });
  });

  it("should rethrow if RemoteLogin throws", async () => {
    const { sut, remoteLoginStub } = makeSut();
    vi.spyOn(remoteLoginStub, "execute").mockRejectedValueOnce(new Error("remoteLogin error"));

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("remoteLogin error")
    });
  });
});
