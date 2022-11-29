export class DbConnectionError extends Error {
  constructor() {
    super("Falha na conexão com o banco de dados");
  }
}
