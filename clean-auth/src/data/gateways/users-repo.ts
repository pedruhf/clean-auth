export namespace SaveUserRepo {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };
  export type Output = void;
}

export interface SaveUserRepo {
  save: (input: SaveUserRepo.Input) => Promise<SaveUserRepo.Output>;
}
