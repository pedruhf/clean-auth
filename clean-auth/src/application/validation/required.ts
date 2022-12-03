import { Validator } from "@/application/protocols";
import { RequiredFieldError } from "../errors";

export class Required implements Validator {
  constructor(
    protected readonly value: any,
    protected readonly fieldName: string
  ) {}

  validate(): Error | undefined {
    if (!this.value) return new RequiredFieldError(this.fieldName);
  }
}

export class RequiredString extends Required {
  constructor(
    protected readonly value: string,
    protected readonly fieldName: string
  ) {
    super(value, fieldName);
  }

  override validate(): Error | undefined {
    if (super.validate() || !this.value.trim().length) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
