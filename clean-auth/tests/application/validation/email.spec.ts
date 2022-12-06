import { describe, it } from "vitest";
import { faker } from "@faker-js/faker";

import { EmailFormatValidator, EmailExistsValidator, EmailInUseValidator } from "@/application/validation";
import { GetUserByEmailRepo } from "@/data/repos";
import { User } from "@/domain/models";
import { BadlyFormattedEmail, EmailInUseError, EmailNotFoundError } from "@/application/errors";
import { getUserMock } from "@/tests/domain/mocks";

const mockedUser = getUserMock();
class UserRepoStub implements GetUserByEmailRepo {
  async getUserByEmail (email: string): Promise<User | undefined> {
    return Promise.resolve(mockedUser);
  }
}

describe("EmailFormatValidator", () => {
  it("should return BadlyFormattedEmail if email is not formatted correctly", async () => {
    const sut = new EmailFormatValidator("invalid_email");

    const error = await sut.validate();

    expect(error).toEqual(new BadlyFormattedEmail());
  });

  it("should return undefined", async () => {

    const sut = new EmailFormatValidator(faker.internet.email().toLowerCase());
    const error = await sut.validate();

    expect(error).toBe(undefined);
  });
});

describe("EmailExistsValidator", () => {
  it("should return EmailNotFoundError if email is not found", async () => {
    const userRepoStub = new UserRepoStub();
    vi.spyOn(userRepoStub, "getUserByEmail").mockResolvedValueOnce(undefined);

    const sut = new EmailExistsValidator(userRepoStub, faker.internet.email());
    const error = await sut.validate();

    expect(error).toEqual(new EmailNotFoundError());
  });

  it("should return undefined if email is founded", async () => {
    const userRepoStub = new UserRepoStub();

    const sut = new EmailExistsValidator(userRepoStub, mockedUser.email.toLowerCase());
    const error = await sut.validate();

    expect(error).toBe(undefined);
  });
});

describe("EmailInUseValidator", () => {
  it("should return EmailInUseError if email is founded", async () => {
    const userRepoStub = new UserRepoStub();

    const sut = new EmailInUseValidator(userRepoStub, mockedUser.email.toLowerCase());
    const error = await sut.validate();

    expect(error).toEqual(new EmailInUseError());
  });

  it("should return undefined if email is founded", async () => {
    const userRepoStub = new UserRepoStub();
    vi.spyOn(userRepoStub, "getUserByEmail").mockResolvedValueOnce(undefined);

    const sut = new EmailInUseValidator(userRepoStub, faker.internet.email());
    const error = await sut.validate();

    expect(error).toBe(undefined);
  });
});
