import { Validator } from "@/application/protocols";
import { MinLengthError } from "@/application/errors";

export class MinLengthValidator implements Validator {
  constructor(
    private readonly value: string,
    private readonly minLength: number,
    private readonly fieldName: string
  ) {}

  validate(): Error | undefined {
    if (this.value.length < this.minLength)
      return new MinLengthError(this.minLength, this.fieldName);
  }
}
