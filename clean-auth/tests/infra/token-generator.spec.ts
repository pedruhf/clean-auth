import { beforeAll, describe, expect, it, Mock, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { sign } from "jsonwebtoken";
import { JwtAdapter } from "@/infra";

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(),
}));

const makeSut = () => {
  const sut = new JwtAdapter();
  return { sut };
};

describe("JwtAdapter", () => {
  let signSpy: Mock;

  beforeAll(() => {
    signSpy = vi.fn().mockReturnValue("any_token");
    vi.mocked(sign).mockImplementation(signSpy);
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
});
