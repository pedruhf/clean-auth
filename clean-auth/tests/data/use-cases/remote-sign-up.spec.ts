import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { RemoteSignUp } from "@/data/use-cases";
import { User } from "@/domain/models";
import { EmailInUseError } from "@/domain/errors";
import {
  Encrypter,
  GetUserByEmailRepository,
  SaveUserRepo,
} from "@/data/gateways";
import { getUserMock } from "@/tests/domain/mocks";

export class UsersRepoStub implements SaveUserRepo {
  async save(input: SaveUserRepo.Input): Promise<void> {}
}

export class EncrypterStub implements Encrypter {
  encrypt(value: string): string {
    return faker.internet.password();
  }
}

export class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }
}

const makeSut = () => {
  const emailRepositoryStub = new GetUserByEmailRepositoryStub();
  const encrypterStub = new EncrypterStub();
  const usersRepoStub = new UsersRepoStub();
  const sut = new RemoteSignUp(
    emailRepositoryStub,
    encrypterStub,
    usersRepoStub
  );

  return { sut, emailRepositoryStub, encrypterStub, usersRepoStub };
};

describe("RemoteSignUp UseCase", () => {
  it("should call EmailRepository with correct input", async () => {
    const { sut, emailRepositoryStub } = makeSut();
    const getUserByEmailSpy = vi.spyOn(emailRepositoryStub, "getUserByEmail");

    const input = getUserMock();
    await sut.execute(input);

    expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(getUserByEmailSpy).toHaveBeenCalledWith(input.email);
  });

  it("should throw EmailInUseError", async () => {
    const { sut, emailRepositoryStub } = makeSut();
    vi.spyOn(emailRepositoryStub, "getUserByEmail").mockResolvedValueOnce(
      getUserMock()
    );

    const resultPromise = sut.execute(getUserMock());

    await expect(resultPromise).rejects.toThrow(new EmailInUseError());
  });

  it("should rethrow if EmailRepository throws", async () => {
    const { sut, emailRepositoryStub } = makeSut();
    vi.spyOn(emailRepositoryStub, "getUserByEmail").mockRejectedValueOnce(
      new Error("getUserByEmail error")
    );

    const resultPromise = sut.execute(getUserMock());

    await expect(resultPromise).rejects.toThrow(
      new Error("getUserByEmail error")
    );
  });

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
