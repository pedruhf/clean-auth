export class AccessDeniedError extends Error {
  constructor () {
    super("Acesso não autorizado!");
  }
}
