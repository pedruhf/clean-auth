import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";

import { BcryptAdapter } from "@/infra";

vi.mock("bcrypt", () => ({
  hashSync: vi.fn(),
}));

const makeSut = () => {
  const sut = new BcryptAdapter();
  return { sut };
};

describe("BcryptAdapter", () => {
  let hashSyncSpy: Mock;

  beforeAll(() => {
    hashSyncSpy = vi.fn().mockReturnValue("hashed_value");
    vi.mocked(hashSync).mockImplementation(hashSyncSpy);
  });

  it("should call hashSync with correct input", () => {
    const { sut } = makeSut();

    const input = faker.address.city();
    sut.encrypt(input);

    expect(hashSyncSpy).toHaveBeenCalledTimes(1);
    expect(hashSyncSpy).toHaveBeenCalledWith(input, BcryptAdapter.salt);
  });

  it("should return the same result of hashSync", () => {
    const { sut } = makeSut();

    const result = sut.encrypt(faker.address.city());

    expect(result).toBe("hashed_value");
  });

  it("should rethrow if hashSync throws", () => {
    const { sut } = makeSut();
    hashSyncSpy.mockImplementationOnce(() => {
      throw new Error("bcrypt error");
    });

    expect(() => sut.encrypt(faker.address.city())).toThrow(
      new Error("bcrypt error")
    );
  });
});
