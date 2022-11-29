import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { sign, verify } from "jsonwebtoken";

import { JwtAdapter } from "@/infra";
import { AccessDeniedError } from "@/application/errors";

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(),
  verify: vi.fn(),
}));

const makeSut = () => {
  const sut = new JwtAdapter();
  return { sut };
};

describe("JwtAdapter", () => {
  let signSpy: Mock;
  let verifySpy: Mock;

  beforeAll(() => {
    signSpy = vi.fn().mockReturnValue("any_token");
    vi.mocked(sign).mockImplementation(signSpy);
    verifySpy = vi.fn().mockReturnValue({ id: "any_id" });
    vi.mocked(verify).mockImplementation(verifySpy);
  });

  describe("generate", () => {
    it("should call sign with correct input", () => {
      const { sut } = makeSut();

      const id = faker.datatype.number();
      sut.generate(id);

      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith({ id }, "any_secret", {
        expiresIn: JwtAdapter.expiresTimeInMs,
      });
    });

    it("should return the same result of sign", () => {
      const { sut } = makeSut();

      const id = faker.datatype.number();
      const result = sut.generate(id);

      expect(result).toBe("any_token");
    });

    it("should rethrow if sign throws", () => {
      const { sut } = makeSut();
      signSpy.mockImplementationOnce(() => {
        throw new Error("sign error");
      });

      const id = faker.datatype.number();

      expect(() => sut.generate(id)).toThrow(new Error("sign error"));
    });
  });

  describe("decrypt", () => {
    it("should call verify with correct input", () => {
      const { sut } = makeSut();

      const encryptedValue = faker.internet.password();
      sut.decrypt(encryptedValue);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith(encryptedValue, "any_secret");
    });

    it("should return decrypted value", () => {
      const { sut } = makeSut();

      const encryptedValue = faker.internet.password();
      const result = sut.decrypt(encryptedValue);

      expect(result).toBe("any_id");
    });

    it("should rethrow if verify throws", () => {
      const { sut } = makeSut();
      verifySpy.mockImplementationOnce(() => {
        throw new Error("verify error");
      });

      const encryptedValue = faker.internet.password();

      expect(() => sut.decrypt(encryptedValue)).toThrow(new AccessDeniedError());
    });
  });
});
