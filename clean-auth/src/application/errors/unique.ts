export class UniqueFieldInUseError extends Error {
  constructor(entityName: string, fieldName: string) {
    super(`Já existe um(a) ${entityName} com este(a) ${fieldName}`);
    this.name = "UniqueFieldInUseError";
  }
}
