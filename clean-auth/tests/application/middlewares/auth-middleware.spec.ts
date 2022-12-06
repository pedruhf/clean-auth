import { describe, it } from "vitest";
import { AuthMiddleware } from "@/application/middlewares";
import { TokenDecrypter } from "@/data/gateways";
import { UnauthorizedError } from "@/application/errors";
import { faker } from "@faker-js/faker";

class TokenDecrypterStub implements TokenDecrypter {
  decrypt (encryptedValue: string): string {
    return "1";
  }
}

const makeSut = () => {
  const tokenDecrypterStub = new TokenDecrypterStub();
  const sut = new AuthMiddleware(tokenDecrypterStub);
  return { sut, tokenDecrypterStub };
}

describe("AuthMiddleware", () => {
  it("should return statusCode 401 and UnauthorizedError if authorization is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.handle({});

    expect(result).toEqual({ statusCode: 401, data: new UnauthorizedError() });
  });

  it("should call TokenDecrypter with correct input", async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    const decryptSpy = vi.spyOn(tokenDecrypterStub, "decrypt");

    const input = { authorization: faker.internet.password() };
    await sut.handle(input);

    expect(decryptSpy).toHaveBeenCalledTimes(1);
    expect(decryptSpy).toHaveBeenCalledWith(input.authorization);
  });

  it("should return statusCode 401 and UnauthorizedError if TokenDecrypter throws", async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    vi.spyOn(tokenDecrypterStub, "decrypt").mockImplementationOnce(() => { throw new Error("decrypt error") });

    const input = { authorization: faker.internet.password() };
    const result = await sut.handle(input)

    expect(result).toEqual({ statusCode: 401, data: new UnauthorizedError() });
  });

  it("should return statusCode 200 and correct data on success", async () => {
    const { sut } = makeSut();

    const input = { authorization: faker.internet.password() };
    const result = await sut.handle(input)

    expect(result).toEqual({ statusCode: 200, data: { userId: "1" }});
  });
});
