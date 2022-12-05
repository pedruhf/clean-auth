import { describe, expect, it, vi } from "vitest";

import { GetUsersRepo } from "@/data/gateways";
import { GetUsers } from "@/domain/features";
import { DbGetUsers } from "@/data/use-cases";
import { getUserMock } from "@/tests/domain/mocks";

export class UsersRepoStub implements GetUsersRepo {
  async getAll (input: GetUsersRepo.Input): Promise<GetUsersRepo.Output> {
    return Promise.resolve([getUserMock()]);
  }
}

const makeSut = () => {
  const usersRepoStub = new UsersRepoStub();
  const sut = new DbGetUsers(usersRepoStub);

  return { sut, usersRepoStub };
};

describe("DbGetUsers UseCase", () => {
  let input: GetUsers.Input;

  beforeAll(() => {
    input = { page: 1, limit: 10 };
  });

  it("should call UsersRepo with correct input", async () => {
    const { sut, usersRepoStub } = makeSut();
    const getAllSpy = vi.spyOn(usersRepoStub, "getAll");

    await sut.execute(input);

    expect(getAllSpy).toHaveBeenCalledTimes(1);
    expect(getAllSpy).toHaveBeenCalledWith(input);
  });

  it("should return a list of users on success", async () => {
    const { sut, usersRepoStub } = makeSut();
    const mockedResult = [getUserMock(), getUserMock(), getUserMock()]
    vi.spyOn(usersRepoStub, "getAll").mockResolvedValueOnce(mockedResult);

    const result = await sut.execute(input);

    expect(result).toEqual(mockedResult)
  });

  it("should rethrow if usersRepo throws", async () => {
    const { sut, usersRepoStub } = makeSut();
    vi.spyOn(usersRepoStub, "getAll").mockRejectedValueOnce(new Error("getAll error"))

    const resultPromise = sut.execute(input);

    await expect(resultPromise).rejects.toThrow(new Error("getAll error"))
  });
});
