import { Validator } from "@/application/protocols";
import { BadlyFormattedEmail, EmailInUseError } from "@/application/errors";
import { UserRepo } from "@/data/gateways";

export class EmailValidator implements Validator {
  constructor(
    private readonly usersRepo: UserRepo,
    private readonly value: string
  ) {}

  formatValidator(): Error | undefined {
    const emailRegex = new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i);
    if (!emailRegex.test(this.value)) {
      return new BadlyFormattedEmail();
    }
  }

  async inUseValidator(): Promise<Error | undefined> {
    const foundedEmail = await this.usersRepo.getUserByEmail(this.value);
    if (!foundedEmail) {
      return new EmailInUseError();
    }
  }

  async validate (): Promise<Error | undefined> {
    const formatError = this.formatValidator();
    if (formatError) return formatError;

    const inUseError = await this.inUseValidator();
    if (inUseError) return inUseError;
  }
}
