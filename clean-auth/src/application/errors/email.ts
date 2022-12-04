export class BadlyFormattedEmail extends Error {
  constructor() {
    super("E-mail mal formatado");
    this.name = "BadlyFormattedEmail";
  }
}

export class EmailInUseError extends Error {
  constructor() {
    super("Este e-mail já está sendo utilizado");
    this.name = "EmailInUseError";
  }
}

export class EmailNotFoundError extends Error {
  constructor() {
    super("E-mail não encontrado");
    this.name = "EmailNotFoundError";
  }
}
