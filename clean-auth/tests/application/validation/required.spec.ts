import { describe, it } from "vitest";
import { faker } from "@faker-js/faker";

import { RequiredStringValidator, RequiredValidator } from "@/application/validation";
import { RequiredFieldError } from "@/application/errors";

describe("RequiredValidator", () => {
  it("should return RequiredFieldError if value is not provided", () => {
    const sut = new RequiredValidator(undefined as any, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"))
  });

  it("should return undefined on success", () => {
    const sut = new RequiredValidator({ name: faker.name.fullName() }, "any_field");
    const error = sut.validate();

    expect(error).toBe(undefined);
  });
});

describe("RequiredStringValidator", () => {
  it("should return RequiredFieldError if value is not provided", () => {
    const sut = new RequiredStringValidator(undefined as any, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"))
  });

  it("should return RequiredFieldError if value is empty", () => {
    const sut = new RequiredStringValidator("", "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"))
  });

  it("should return RequiredFieldError if value is in blank", () => {
    const sut = new RequiredStringValidator("    ", "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"))
  });

  it("should return undefined on success", () => {
    const sut = new RequiredStringValidator("value", "any_field");
    const error = sut.validate();

    expect(error).toBe(undefined);
  });
});
