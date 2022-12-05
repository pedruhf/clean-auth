import { User } from "@/domain/models";

export namespace GetUsers {
  export type Input = {
    page: number;
    limit: number;
  }

  export type Output = User[];
}

export interface GetUsers {
  execute: (input: GetUsers.Input) => Promise<GetUsers.Output>
}
