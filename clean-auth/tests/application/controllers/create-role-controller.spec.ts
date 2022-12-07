import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { CreateRole } from "@/domain/features";
import { EmailInUseError, RequiredFieldError } from "@/application/errors";
import { CreateRoleController } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";
import { getRoleMock } from "@/tests/domain/mocks";
import { GetRoleByNameRepo } from "@/data/repos";
import { Role, Permissions } from "@/domain/models";

export class UniqueFieldInUseError extends Error {
  constructor(entityName: string, fieldName: string) {
    super(`Já existe um(a) ${entityName} com este(a) ${fieldName}`);
    this.name = "UniqueFieldInUseError";
  }
}

class CreateRoleStub implements CreateRole {
  async execute(input: CreateRole.Input): Promise<void> {}
}

class RoleRepoStub implements GetRoleByNameRepo {
  async getByName(name: string): Promise<Role> {
    return Promise.resolve(getRoleMock() as Role);
  }
}

const makeSut = () => {
  const createRoleStub = new CreateRoleStub();
  const roleRepoStub = new RoleRepoStub();
  const sut = new CreateRoleController(createRoleStub, roleRepoStub);
  return { sut, createRoleStub, roleRepoStub };
};

describe("SignUp Controller", () => {
  let request: HttpRequest;

  beforeAll(() => {
    request = {
      body: {
        name: faker.name.jobArea(),
        permissions: faker.helpers.arrayElements(Object.values(Permissions)),
      },
    };
  });

  it("should return statusCode 400 with RequiredFieldError if name is not provided", async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        permissions: faker.helpers.arrayElements(Object.values(Permissions)),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("nome"),
    });
  });

  it("should return statusCode 400 and RequiredFieldError if permissions is not provided", async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: faker.name.jobArea(),
      },
    };
    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("permissões"),
    });
  });

  // it("should return statusCode 400 and UniqueFieldInUseError", async () => {
  //   const { sut, roleRepoStub } = makeSut();
  //   vi.spyOn(roleRepoStub, "getByName").mockResolvedValueOnce(
  //     getRoleMock() as Role
  //   );

  //   const result = await sut.handle(request);

  //   expect(result).toEqual({
  //     statusCode: 400,
  //     data: new UniqueFieldInUseError("cargo", "nome"),
  //   });
  // });

  // it("should return 500 and repass error if EmailRepository throws", async () => {
  //   const { sut, roleRepoStub } = makeSut();
  //   vi.spyOn(roleRepoStub, "getByName").mockRejectedValueOnce(
  //     new Error("getByName error")
  //   );
  //   const result = await sut.handle(request);

  //   expect(result).toEqual({
  //     statusCode: 500,
  //     data: new Error("getByName error"),
  //   });
  // });

  it("should call CreateRole with correct input", async () => {
    const { sut, createRoleStub } = makeSut();
    const executeSpy = vi.spyOn(createRoleStub, "execute");

    await sut.handle(request);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(request.body);
  });

  it("should return 201 on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 201,
    });
  });

  it("should return 500 if RemoteSignUp throws", async () => {
    const { sut, createRoleStub } = makeSut();
    vi.spyOn(createRoleStub, "execute").mockRejectedValueOnce(
      new Error("createRole Error")
    );

    const result = await sut.handle(request);

    expect(result).toEqual({
      statusCode: 500,
      data: new Error("createRole Error"),
    });
  });
});
