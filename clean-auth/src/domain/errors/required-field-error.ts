export class RequiredFieldError extends Error {
  constructor(paramName: string) {
    super(`O campo ${paramName} é obrigatório`);
    this.name = "MissingParamError";
  }
}
