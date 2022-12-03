import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { SignUp } from "@/domain/features";
import { EmailInUseError, RequiredFieldError } from "@/application/errors";
import { SignUpController } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";
import { GetUserByEmailRepository } from "@/data/gateways";
import { User } from "@/domain/models";
import { getUserMock } from "@/tests/domain/mocks";
import { DbConnectionError } from "@/infra/errors";

class RemoteSignUpStub implements SignUp {
  async execute(input: SignUp.Input): Promise<void> {}
}

export class UsersRepoStub implements GetUserByEmailRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }
}

const makeSut = () => {
  const remoteSignUpStub = new RemoteSignUpStub();
  const usersRepoStub = new UsersRepoStub();
  const sut = new SignUpController(usersRepoStub, remoteSignUpStub);
  return { sut, usersRepoStub, remoteSignUpStub };
};

describe("SignUp Controller", () => {
  it("should return RequiredFieldError if name is not provided", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("nome"),
    });
  });

  it("should return RequiredFieldError if email is not provided", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        name: faker.name.fullName(),
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
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("senha"),
    });
  });

  it("should call EmailRepository with correct input", async () => {
    const { sut, usersRepoStub } = makeSut();
    const getUserByEmailSpy = vi.spyOn(usersRepoStub, "getUserByEmail");

    const body = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.handle({ body });

    expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(getUserByEmailSpy).toHaveBeenCalledWith(body.email);
  });

  it("should return statusCode 400 and EmailInUseError", async () => {
    const { sut, usersRepoStub } = makeSut();
    vi.spyOn(usersRepoStub, "getUserByEmail").mockResolvedValueOnce(
      getUserMock()
    );

    const body = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = await sut.handle({ body });

    expect(result).toEqual({
      statusCode: 400,
      data: new EmailInUseError(),
    });
  });

  it("should return 500 and repass error if EmailRepository throws", async () => {
    const { sut, usersRepoStub } = makeSut();
    vi.spyOn(usersRepoStub, "getUserByEmail").mockRejectedValueOnce(
      new Error("getUserByEmail error")
    );

    const body = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = await sut.handle({ body });

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("getUserByEmail error"),
    })
  });

  it("should call RemoteSignUp with correct input", async () => {
    const { sut, remoteSignUpStub } = makeSut();
    const executeSpy = vi.spyOn(remoteSignUpStub, "execute");

    const body = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.handle({ body });

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(body);
  });

  it("should return 201 on success", async () => {
    const { sut } = makeSut();

    const body = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = await sut.handle({ body });

    expect(result).toEqual({
      statusCode: 201,
    });
  });

  it("should return 500 if RemoteSignUp throws", async () => {
    const { sut, remoteSignUpStub } = makeSut();
    vi.spyOn(remoteSignUpStub, "execute").mockRejectedValueOnce(
      new Error("signUp Error")
    );

    const body = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = await sut.handle({ body });

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("signUp Error"),
    });
  });
});
