import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { Permissions } from "@/domain/models";
import { PgRoleRepo } from "@/infra/database/repos";
import { DbConnectionError } from "@/infra/errors";
import { getRoleMock } from "@/tests/domain/mocks";

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(),
}));

const makeSut = () => {
  const sut = PgRoleRepo.getInstance();

  return { sut };
};

describe("PgUserRepo", () => {
  let PrismaClientSpy: Mock;
  let createSpy: Mock;
  let findUniqueSpy: Mock;

  beforeAll(() => {
    createSpy = vi.fn();
    findUniqueSpy = vi.fn();
    PrismaClientSpy = vi.fn().mockReturnValue({
      role: {
        create: createSpy,
        findUnique: findUniqueSpy,
      },
    });
    vi.mocked(PrismaClient).mockImplementation(PrismaClientSpy);
  });

  it("should be a singleton", () => {
    const { sut } = makeSut();
    const sut2 = PgRoleRepo.getInstance();
    expect(sut).toBe(sut2);
  });

  describe("save", () => {
    let input: { name: string; permissions: Permissions[] };

    beforeAll(() => {
      const permissions = Object.values(Permissions);
      input = {
        name: faker.name.jobArea(),
        permissions: faker.helpers.arrayElements(permissions),
      };
    });

    it("should call create with correct input", async () => {
      const { sut } = makeSut();

      await sut.save(input);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          name: input.name,
          permissions: input.permissions,
        },
      });
    });

    it("should throw DbConnectionError if create throws", async () => {
      const { sut } = makeSut();
      createSpy.mockRejectedValueOnce(new Error("create error"));

      const resultPromise = sut.save(input);

      await expect(resultPromise).rejects.toThrow(new DbConnectionError());
    });
  });

  describe("getByName", () => {
    const mockedRole = getRoleMock();
    const input = mockedRole.name;

    beforeAll(() => {
      findUniqueSpy.mockReturnValue(mockedRole)
    });

    it("should call findUnique with correct input", async () => {
      const { sut } = makeSut();

      await sut.getByName(input);

      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: {
          name: input,
        },
      });
    });

    it("should return role on success", async () => {
      const { sut } = makeSut();

      const role = await sut.getByName(input);

      expect(role).toMatchObject(mockedRole)
    });

    it("should return undefined on failure", async () => {
      const { sut } = makeSut();
      findUniqueSpy.mockResolvedValueOnce(undefined);

      const user = await sut.getByName(input);

      expect(user).toBe(undefined);
    });

    it("should throw DbConnectionError if findUnique throws", async () => {
      const { sut } = makeSut();
      findUniqueSpy.mockRejectedValueOnce(new Error("findUnique error"));

      const resultPromise = sut.getByName(input);

      await expect(resultPromise).rejects.toThrow(new DbConnectionError());
    });
  });
});
