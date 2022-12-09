import { describe, it } from "vitest";
import { RoleMiddleware } from "@/application/middlewares";
import { AccessDeniedError, UnauthorizedError } from "@/application/errors";
import { faker } from "@faker-js/faker";
import { GetUserById } from "@/data/repos";
import { User } from "@/domain/models";
import { getUserMock } from "@/tests/domain/mocks";

class UserRepoStub implements GetUserById {
  async getById (id: number): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }
}

const makeSut = () => {
  const userRepoStub = new UserRepoStub();
  const sut = new RoleMiddleware(["admin", "user"], userRepoStub);
  return { sut, userRepoStub };
}

describe("AuthMiddleware", () => {
  const input = { userId: "1" };

  it("should return statusCode 403 and AccessDeniedError if userId is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.handle({} as any);

    expect(result).toEqual({ statusCode: 403, data: new AccessDeniedError() });
  });

  it("should return statusCode 403 and AccessDeniedError if userId is NaN", async () => {
    const { sut } = makeSut();

    const result = await sut.handle({ userId: "any_id" });

    expect(result).toEqual({ statusCode: 403, data: new AccessDeniedError() });
  });

  it("should return call UserRepo with correct input", async () => {
    const { sut, userRepoStub} = makeSut();
    const getByIdSpy = vi.spyOn(userRepoStub, "getById");

    await sut.handle(input);

    expect(getByIdSpy).toHaveBeenCalledTimes(1);
    expect(getByIdSpy).toHaveBeenCalledWith(Number(input.userId));
  });

  it("should return statusCode 403 and AccessDeniedError if not found user", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(input);

    expect(result).toEqual({ statusCode: 403, data: new AccessDeniedError() });
  });

  it("should return statusCode 403 and AccessDeniedError if UserRepo throws", async () => {
    const { sut, userRepoStub } = makeSut();
    vi.spyOn(userRepoStub, "getById").mockRejectedValueOnce(new Error("getById error"));

    const result = await sut.handle(input);

    expect(result).toEqual({ statusCode: 403, data: new AccessDeniedError() });
  });

  it("should return statusCode 403 and AccessDeniedError if role nots match", async () => {
    const { sut, userRepoStub } = makeSut();
    vi.spyOn(userRepoStub, "getById").mockResolvedValueOnce({ ...getUserMock() });
    const result = await sut.handle(input);

    expect(result).toEqual({ statusCode: 403, data: new AccessDeniedError() });
  });

  it("should return statusCode 200 and correct data on success", async () => {
    const { sut, userRepoStub } = makeSut();
    const mockedUser = getUserMock();
    vi.spyOn(userRepoStub, "getById").mockResolvedValueOnce({
      ...mockedUser,
      role: {
        ...mockedUser.role,
        name: "admin"
      },
    });

    const result = await sut.handle(input);

    expect(result).toEqual({
      statusCode: 200,
      data: {
        userRole: {
          ...mockedUser.role,
          name: "admin"
        },
      }});
  });
});
