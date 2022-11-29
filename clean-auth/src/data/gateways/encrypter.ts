export interface Encrypter {
  encrypt: (value: string) => string;
}

export interface EncryptComparer {
  compare: (encryptedValue: string, value: string) => boolean;
}

