export class MinLengthError extends Error {
  constructor(minLength: number, fieldName: string) {
    super(`O campo ${fieldName} deve conter no mínimo ${minLength} caracteres`);
    this.name = "MinLengthError";
  }
}
