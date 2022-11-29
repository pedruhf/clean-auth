import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { hashSync, compareSync } from "bcrypt";

import { BcryptAdapter } from "@/infra";

vi.mock("bcrypt", () => ({
  hashSync: vi.fn(),
  compareSync: vi.fn(),
}));

const makeSut = () => {
  const sut = new BcryptAdapter();
  return { sut };
};

describe("BcryptAdapter", () => {
  let hashSyncSpy: Mock;
  let compareSyncSpy: Mock;

  beforeAll(() => {
    compareSyncSpy = vi.fn().mockReturnValue(true);
    hashSyncSpy = vi.fn().mockReturnValue("hashed_value");
    vi.mocked(hashSync).mockImplementation(hashSyncSpy);
    vi.mocked(compareSync).mockImplementation(compareSyncSpy);
  });

  describe("hashSync", () => {
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

  describe("compare", () => {
    it("should call compareSync with correct input", () => {
      const { sut } = makeSut();

      const encryptedValue = faker.internet.password();
      const value = faker.internet.email();
      sut.compare(encryptedValue, value);

      expect(compareSyncSpy).toHaveBeenCalledTimes(1);
      expect(compareSyncSpy).toHaveBeenCalledWith(value, encryptedValue);
    });

    it("should return the same result of compareSync", () => {
      const { sut } = makeSut();

      const result = sut.compare(faker.internet.password(), faker.internet.email());

      expect(result).toBe(true);
    });

    it("should rethrow if compareSync throws", () => {
      const { sut } = makeSut();
      compareSyncSpy.mockImplementationOnce(() => {
        throw new Error("compareSync error");
      });

      expect(() => sut.compare(faker.internet.password(), faker.internet.email())).toThrow(
        new Error("compareSync error")
      );
    });
  });
});
