import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { User } from "@/domain/models";
import { PgUserRepo } from "@/infra/database/repos";
import { DbConnectionError } from "@/infra/errors";
import { getUserMock } from "@/tests/domain/mocks";

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(),
}));

const makeSut = () => {
  const sut = PgUserRepo.getInstance();

  return { sut };
};

describe("PgUserRepo", () => {
  let PrismaClientSpy: Mock;
  let createUserSpy: Mock;
  let findUniqueUserSpy: Mock;
  let findManyUsersSpy: Mock;
  let mockedUser: User;
  let mockedUserList: User[];

  beforeAll(() => {
    mockedUser = getUserMock();
    mockedUserList = [getUserMock(), getUserMock(), getUserMock()]

    createUserSpy = vi.fn();
    findUniqueUserSpy = vi.fn().mockReturnValue(mockedUser);
    findManyUsersSpy = vi.fn().mockReturnValue(mockedUserList);
    PrismaClientSpy = vi.fn().mockReturnValue({
      user: {
        create: createUserSpy,
        findUnique: findUniqueUserSpy,
        findMany: findManyUsersSpy,
      },
    });
    vi.mocked(PrismaClient).mockImplementation(PrismaClientSpy);
  });

  it("should be a singleton", () => {
    const { sut } = makeSut();
    const sut2 = PgUserRepo.getInstance();
    expect(sut).toBe(sut2);
  });

  describe("save", () => {
    it("should call create with correct input", async () => {
      const { sut } = makeSut();

      const input = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await sut.save(input);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith({
        data: {
          name: input.name,
          email: input.email.toLowerCase(),
          password: input.password,
        },
      });
    });

    it("should throw DbConnectionError if create throws", async () => {
      const { sut } = makeSut();
      createUserSpy.mockRejectedValueOnce(new Error("create error"));

      const input = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const resultPromise = sut.save(input);

      await expect(resultPromise).rejects.toThrow(new DbConnectionError());
    });
  });

  describe("getUserByEmail", () => {
    it("should call findUnique with correct email", async () => {
      const { sut } = makeSut();

      const input = faker.internet.email();
      await sut.getUserByEmail(input);

      expect(findUniqueUserSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueUserSpy).toHaveBeenCalledWith({
        where: {
          email: input.toLowerCase(),
        },
      });
    });

    it("should return user on success", async () => {
      const { sut } = makeSut();

      const input = faker.internet.email();
      const user = await sut.getUserByEmail(input);

      expect(user).toMatchObject(mockedUser)
    });

    it("should return undefined on failure", async () => {
      const { sut } = makeSut();
      findUniqueUserSpy.mockResolvedValueOnce(undefined);

      const input = faker.internet.email();
      const user = await sut.getUserByEmail(input);

      expect(user).toBe(undefined);
    });

    it("should throw DbConnectionError if findUnique throws", async () => {
      const { sut } = makeSut();
      findUniqueUserSpy.mockRejectedValueOnce(new Error("findUnique error"));

      const input = faker.internet.email();
      const resultPromise = sut.getUserByEmail(input);

      await expect(resultPromise).rejects.toThrow(new DbConnectionError());
    });
  });

  describe("getAll", () => {
    const input = { page: 2, limit: 10 };

    it("should call findMany with correct fields", async () => {
      const { sut } = makeSut();

      await sut.getAll(input);

      expect(findManyUsersSpy).toHaveBeenCalledTimes(1);
      expect(findManyUsersSpy).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          password: false,
         },
        skip: 10,
        take: 10,
      });
    });

    it("should return a list of users on success", async () => {
      const { sut } = makeSut();

      const user = await sut.getAll(input);

      expect(user).toMatchObject(mockedUserList)
    });

    it("should throw DbConnectionError if findMany throws", async () => {
      const { sut } = makeSut();
      findManyUsersSpy.mockRejectedValueOnce(new Error("findMany error"));

      const resultPromise = sut.getAll(input);

      await expect(resultPromise).rejects.toThrow(new DbConnectionError());
    });
  });
});
