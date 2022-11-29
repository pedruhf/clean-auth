export interface Encrypter {
  encrypt: (value: string) => string;
}

export interface EncryptComparer {
  compare: (encryptedValue: string, value: string) => boolean;
}

export interface Decrypter {
  decrypt: (encryptedValue: string) => string;
}
