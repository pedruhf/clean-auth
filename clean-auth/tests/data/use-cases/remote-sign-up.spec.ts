import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { RemoteSignUp } from "@/data/use-cases/auth";
import { User } from "@/domain/models";
import { Encrypter } from "@/data/gateways";
import { GetUserByEmailRepo, SaveUserRepo } from "@/data/repos";
import { getUserMock } from "@/tests/domain/mocks";

export class UsersRepoStub implements SaveUserRepo, GetUserByEmailRepo {
  async save(input: SaveUserRepo.Input): Promise<void> {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }
}

export class EncrypterStub implements Encrypter {
  encrypt(value: string): string {
    return faker.internet.password();
  }
}

const makeSut = () => {
  const encrypterStub = new EncrypterStub();
  const usersRepoStub = new UsersRepoStub();
  const sut = new RemoteSignUp(usersRepoStub, encrypterStub);

  return { sut, encrypterStub, usersRepoStub };
};

describe("RemoteSignUp UseCase", () => {
  it("should call Encrypter with correct input", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = vi.spyOn(encrypterStub, "encrypt");

    const input = getUserMock();
    await sut.execute(input);

    expect(encryptSpy).toHaveBeenCalledTimes(1);
    expect(encryptSpy).toHaveBeenCalledWith(input.password);
  });

  it("should rethrows if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    vi.spyOn(encrypterStub, "encrypt").mockImplementationOnce(() => {
      throw new Error("encrypt error");
    });

    const resultPromise = sut.execute(getUserMock());

    await expect(resultPromise).rejects.toThrow(new Error("encrypt error"));
  });

  it("should call UsersRepo with correct input", async () => {
    const { sut, encrypterStub, usersRepoStub } = makeSut();
    vi.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
      "encrypted_password"
    );
    const usersRepoSpy = vi.spyOn(usersRepoStub, "save");

    const input = getUserMock();
    await sut.execute(input);

    expect(usersRepoSpy).toHaveBeenCalledTimes(1);
    expect(usersRepoSpy).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: "encrypted_password",
    });
  });
});
