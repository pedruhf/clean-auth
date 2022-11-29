export interface TokenGenerator {
  generate: (id: number) => string;
}

export interface TokenDecrypter {
  decrypt: (encryptedValue: string) => string;
}
