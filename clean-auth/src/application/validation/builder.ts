import { Validator } from "@/application/protocols";
import { EmailFormatValidator } from "./email";
import { MinLengthValidator } from "./min-length";
import { RequiredStringValidator, RequiredValidator } from "./required";

export class ValidatonBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of({ value, fieldName }: { value: any, fieldName: string }): ValidatonBuilder {
    return new ValidatonBuilder(value, fieldName);
  }

  required(): ValidatonBuilder {
    if (typeof this.value === "string") {
      const requiredStringValidator = new RequiredStringValidator(this.value, this.fieldName);
      this.validators.push(requiredStringValidator);
    } else {
      const requiredValidator = new RequiredValidator(this.value, this.fieldName);
      this.validators.push(requiredValidator);
    }

    return this;
  }

  minLength(minLength: number): ValidatonBuilder {
    const minLengthValidator = new MinLengthValidator(this.value, minLength, this.fieldName);
    this.validators.push(minLengthValidator);
    return this;
  }

  email(): ValidatonBuilder {
    const emailFormatValidator = new EmailFormatValidator(this.value);
    this.validators.push(emailFormatValidator);
    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
