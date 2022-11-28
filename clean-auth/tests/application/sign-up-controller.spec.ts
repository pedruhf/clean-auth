import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { SignUp } from "@/domain/features";
import { RequiredFieldError } from "@/domain/errors";
import { SignUpController } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";

class RemoteSignUpStub implements SignUp {
  async execute(input: SignUp.Input): Promise<void> {}
}

const makeSut = () => {
  const remoteSignUpStub = new RemoteSignUpStub();
  const sut = new SignUpController(remoteSignUpStub);
  return { sut, remoteSignUpStub };
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
