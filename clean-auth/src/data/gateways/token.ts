export interface TokenGenerator {
  generate: (id: number) => string;
}
