export namespace SignUp {
  export type Input = {
    name: string;
    email: string;
    password: string;
    roleName: string;
  }

  export type Output = void;
}

export interface SignUp {
  execute: (input: SignUp.Input) => Promise<SignUp.Output>
}
