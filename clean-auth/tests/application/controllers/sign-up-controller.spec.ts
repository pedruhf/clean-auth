import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { SignUp } from "@/domain/features";
import { BadlyFormattedEmail, EmailInUseError, RequiredFieldError } from "@/application/errors";
import { SignUpController } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";
import { GetRoleByNameRepo, GetUserByEmailRepo } from "@/data/repos";
import { Role, Roles, User } from "@/domain/models";
import { getRoleMock, getUserMock } from "@/tests/domain/mocks";

class RemoteSignUpStub implements SignUp {
  async execute(input: SignUp.Input): Promise<void> {}
}

export class UsersRepoStub implements GetUserByEmailRepo {
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }
}

export class RoleRepoStub implements GetRoleByNameRepo {
  async getByName(name: string): Promise<Role | undefined> {
    return Promise.resolve({
      ...getRoleMock(),
      name: "admin"
    });
  }
}

const makeSut = () => {
  const remoteSignUpStub = new RemoteSignUpStub();
  const usersRepoStub = new UsersRepoStub();
  const roleRepoStub = new RoleRepoStub();
  const sut = new SignUpController(usersRepoStub, roleRepoStub, remoteSignUpStub);
  return { sut, usersRepoStub, roleRepoStub, remoteSignUpStub };
};

describe("SignUp Controller", () => {
  let request: {
    body: {
      name: string;
      email: string;
      password: string;
      roleName: string;
    }
  };

  beforeAll(() => {
    request = {
      body: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        roleName: "admin",
      }
    }
  })
  it("should return statusCode 400 with RequiredFieldError if name is not provided", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("nome"),
    });
  });

  it("should return statusCode 400 and RequiredFieldError if email is not provided", async () => {
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

  it("should return statusCode 400 and RequiredFieldError if password is not provided", async () => {
    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        name: faker.name.fullName(),
        email: faker.internet.email().toLowerCase(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("senha"),
    });
  });

  it("should return statusCode 400 and BadlyFormattedEmail", async () => {
    const { sut } = makeSut();

    const body = {
      name: faker.name.fullName(),
      email: "invalid_email",
      password: faker.internet.password(),
    };

    const result = await sut.handle({ body });

    expect(result).toEqual({
      statusCode: 400,
      data: new BadlyFormattedEmail(),
    });
  });

  it("should return statusCode 400 and EmailInUseError", async () => {
    const { sut, usersRepoStub } = makeSut();
    vi.spyOn(usersRepoStub, "getUserByEmail").mockResolvedValueOnce(
      getUserMock()
    );

    const result = await sut.handle(request);

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

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("getUserByEmail error"),
    })
  });

  it("should call RoleRepo with correct input", async () => {
    const { sut, roleRepoStub } = makeSut();
    const getByNameSpy = vi.spyOn(roleRepoStub, "getByName");

    await sut.handle(request);

    expect(getByNameSpy).toHaveBeenCalledTimes(1);
    expect(getByNameSpy).toHaveBeenCalledWith(request.body.roleName);
  });

  it("should call RoleRepo with default input when roleName is not provided", async () => {
    const { sut, roleRepoStub } = makeSut();
    const getByNameSpy = vi.spyOn(roleRepoStub, "getByName");

    const req = {
      body: { ...request.body, roleName: undefined }
    }
    await sut.handle(req);

    expect(getByNameSpy).toHaveBeenCalledTimes(1);
    expect(getByNameSpy).toHaveBeenCalledWith(Roles.user);
  });

  it("should return statusCode 400 and role not found", async () => {
    const { sut, roleRepoStub } = makeSut();
    vi.spyOn(roleRepoStub, "getByName").mockResolvedValueOnce(undefined);

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new Error("Cargo não encontrado"),
    });
  });

  it("should return 500 and repass error if EmailRepository throws", async () => {
    const { sut, roleRepoStub } = makeSut();
    vi.spyOn(roleRepoStub, "getByName").mockRejectedValueOnce(
      new Error("getByName error")
    );

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("getByName error"),
    })
  });

  it("should call RemoteSignUp with correct input", async () => {
    const { sut, remoteSignUpStub } = makeSut();
    const executeSpy = vi.spyOn(remoteSignUpStub, "execute");

    await sut.handle(request);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(request.body);
  });

  it("should return 500 if RemoteSignUp throws", async () => {
    const { sut, remoteSignUpStub } = makeSut();
    vi.spyOn(remoteSignUpStub, "execute").mockRejectedValueOnce(
      new Error("signUp Error")
    );

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("signUp Error"),
    });
  });

  it("should return 201 on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 201,
    });
  });
});
