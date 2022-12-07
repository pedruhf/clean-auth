import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { Permissions } from "@/domain/models";
import { PgRoleRepo } from "@/infra/database/repos";
import { DbConnectionError } from "@/infra/errors";

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

  beforeAll(() => {
    createSpy = vi.fn();
    PrismaClientSpy = vi.fn().mockReturnValue({
      role: {
        create: createSpy,
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
});
