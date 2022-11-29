import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { PgUserRepo } from "@/infra/database";
import { DbConnectionError } from "@/infra/errors";

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

  beforeAll(() => {
    createUserSpy = vi.fn();
    findUniqueUserSpy = vi.fn();
    PrismaClientSpy = vi.fn().mockReturnValue({
      user: {
        create: createUserSpy,
        findUnique: findUniqueUserSpy,
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
          email: input.email,
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
          email: input,
        },
      });
    });

    it("should throw DbConnectionError if findUnique throws", async () => {
      const { sut } = makeSut();
      findUniqueUserSpy.mockRejectedValueOnce(new Error("findUnique error"));

      const input = faker.internet.email();
      const resultPromise = sut.getUserByEmail(input);

      await expect(resultPromise).rejects.toThrow(new DbConnectionError());
    });
  });
});
