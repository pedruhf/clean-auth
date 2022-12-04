import { describe, it } from "vitest";
import { faker } from "@faker-js/faker";

import { EmailValidator, GetEmailValidator } from "@/application/validation";
import { GetUserByEmailRepository } from "@/data/gateways";
import { User } from "@/domain/models";
import { BadlyFormattedEmail, EmailInUseError, EmailNotFoundError } from "@/application/errors";
import { getUserMock } from "@/tests/domain/mocks";

const mockedUser = getUserMock();
class UserRepoStub implements GetUserByEmailRepository {
  async getUserByEmail (email: string): Promise<User | undefined> {
    return Promise.resolve(mockedUser);
  }
}

describe("EmailValidator", () => {
  it("should return BadlyFormattedEmail if email is not formatted correctly", async () => {
    const userRepoStub = new UserRepoStub();
    const sut = new EmailValidator(userRepoStub, "invalid_email");

    const error = await sut.validate();

    expect(error).toEqual(new BadlyFormattedEmail());
  });

  it("should return EmailInUseError", async () => {
    const userRepoStub = new UserRepoStub();
    const sut = new EmailValidator(userRepoStub, mockedUser.email.toLowerCase());

    const error = await sut.validate();

    expect(error).toEqual(new EmailInUseError());
  });

  it("should return undefined", async () => {
    const userRepoStub = new UserRepoStub();
    vi.spyOn(userRepoStub, "getUserByEmail").mockResolvedValueOnce(undefined);

    const sut = new EmailValidator(userRepoStub, faker.internet.email().toLowerCase());
    const error = await sut.validate();

    expect(error).toBe(undefined);
  });
});

describe("GetEmailValidator", () => {
  it("should return EmailNotFoundError if email is not found", async () => {
    const userRepoStub = new UserRepoStub();
    vi.spyOn(userRepoStub, "getUserByEmail").mockResolvedValueOnce(undefined);

    const sut = new GetEmailValidator(userRepoStub, faker.internet.email());
    const error = await sut.validate();

    expect(error).toEqual(new EmailNotFoundError());
  });

  it("should return undefined if email is founded", async () => {
    const userRepoStub = new UserRepoStub();

    const sut = new GetEmailValidator(userRepoStub, mockedUser.email.toLowerCase());
    const error = await sut.validate();

    expect(error).toBe(undefined);
  });
});
