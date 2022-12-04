import { describe, it } from "vitest";
import { MinLengthValidator } from "@/application/validation";
import { MinLengthError } from "@/application/errors";

describe("MinLengthValidator", () => {
  it("should return MinLengthError if value length if less than min length", () => {
    const sut = new MinLengthValidator("less", 5, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new MinLengthError(5, "any_field"));
  });
  it("should return undefined if value length if bigger than min length", () => {
    const sut = new MinLengthValidator("bigger", 5, "any_field");
    const error = sut.validate();

    expect(error).toBe(undefined);
  });
});
