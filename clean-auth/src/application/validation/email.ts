import { Validator } from "@/application/protocols";
import { BadlyFormattedEmail, EmailInUseError, EmailNotFoundError } from "@/application/errors";
import { GetUserByEmailRepository } from "@/data/gateways";

export class EmailFormatValidator implements Validator {
  constructor(
    private readonly value: string
  ) {}

  async validate (): Promise<Error | undefined> {
    const emailRegex = new RegExp(/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
    if (!this.value.match(emailRegex)) {
      return new BadlyFormattedEmail();
    }
  }
}

export class EmailInUseValidator implements Validator {
  constructor(
    private readonly usersRepo: GetUserByEmailRepository,
    private readonly value: string
  ) {}

  async validate(): Promise<Error | undefined> {
    const foundedEmail = await this.usersRepo.getUserByEmail(this.value);
    if (foundedEmail) {
      return new EmailInUseError();
    }
  }
}


export class EmailExistsValidator implements Validator {
  constructor(
    private readonly usersRepo: GetUserByEmailRepository,
    private readonly value: string
  ) {}

  async validate (): Promise<Error | undefined> {
    const foundedEmail = await this.usersRepo.getUserByEmail(this.value);
    if (!foundedEmail) {
      return new EmailNotFoundError();
    }
  }
}
