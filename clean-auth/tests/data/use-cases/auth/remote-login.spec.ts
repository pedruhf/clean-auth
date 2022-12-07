import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { RemoteLogin } from "@/data/use-cases/auth";
import { User } from "@/domain/models";
import { EncryptComparer, TokenGenerator } from "@/data/gateways";
import { GetUserByEmailRepo } from "@/data/repos";
import { getUserMock } from "@/tests/domain/mocks";

export class UsersRepoStub implements GetUserByEmailRepo {
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(mockedUser);
  }
}

export class EncryptComparerStub implements EncryptComparer {
  compare(encryptedValue: string, value: string): boolean {
    return true;
  }
}

export class TokenGeneratorStub implements TokenGenerator {
  generate(id: number): string {
    return "accessToken";
  }
}

const mockedUser = getUserMock();
const makeSut = () => {
  const usersRepoStub = new UsersRepoStub();
  const encryptComparerStub = new EncryptComparerStub();
  const tokenGeneratorStub = new TokenGeneratorStub();
  const sut = new RemoteLogin(
    usersRepoStub,
    encryptComparerStub,
    tokenGeneratorStub
  );

  return { sut, usersRepoStub, encryptComparerStub, tokenGeneratorStub };
};

describe("RemoteLogin UseCase", () => {
  it("should call UsersRepo with correct input", async () => {
    const { sut, usersRepoStub } = makeSut();
    const getUserByEmailSpy = vi.spyOn(usersRepoStub, "getUserByEmail");

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.execute(input);

    expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(getUserByEmailSpy).toHaveBeenCalledWith(input.email);
  });

  it("should rethrow if UsersRepo throws", async () => {
    const { sut, usersRepoStub } = makeSut();
    vi.spyOn(usersRepoStub, "getUserByEmail").mockRejectedValueOnce(
      new Error("getUserByEmail error")
    );

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const resultPromise = sut.execute(input);

    await expect(resultPromise).rejects.toThrow(
      new Error("getUserByEmail error")
    );
  });

  it("should call EncryptComparer with correct input", async () => {
    const { sut, encryptComparerStub } = makeSut();
    const compareSpy = vi.spyOn(encryptComparerStub, "compare");

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.execute(input);

    expect(compareSpy).toHaveBeenCalledTimes(1);
    expect(compareSpy).toHaveBeenCalledWith(
      mockedUser.password,
      input.password
    );
  });

  it("should return undefined if EncryptComparer return falsy", async () => {
    const { sut, encryptComparerStub } = makeSut();
    vi.spyOn(encryptComparerStub, "compare").mockReturnValueOnce(false);

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = await sut.execute(input);

    expect(result).toBe(undefined);
  });

  it("should call TokenGenerator with correct input", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = vi.spyOn(tokenGeneratorStub, "generate");

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.execute(input);

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledWith(mockedUser.id);
  });

  it("should accessToken on success", async () => {
    const { sut } = makeSut();

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = await sut.execute(input);

    expect(result).toMatchObject({
      accessToken: "accessToken",
    });
  });
});
