export namespace SaveUserRepo {
  export type Input = {
    name: string;
    email: string;
    password: string;
    roleName: string;
  };

  export type Output = void;
}

export interface SaveUserRepo {
  save: (input: SaveUserRepo.Input) => Promise<SaveUserRepo.Output>;
}

import { User } from "@/domain/models";

export interface GetUserByEmailRepo {
  getUserByEmail: (email: string) => Promise<User | undefined>;
}

export namespace GetUsersRepo {
  export type Input = {
    page: number;
    limit: number;
  }

  export type Output = User[];
}

export interface GetUsersRepo {
  getAll: (input: GetUsersRepo.Input) => Promise<GetUsersRepo.Output>
}

export interface GetUserById {
  getById: (id: number) => Promise<User | undefined>
}


export type UserRepo = SaveUserRepo & GetUserByEmailRepo & GetUsersRepo & GetUserById;
