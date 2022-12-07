import { Permissions, Role } from "@/domain/models";

export namespace SaveRole {
  export type Input = {
    name: string;
    permissions: Permissions[];
  };

  export type Output = void;
}

export interface SaveRole {
  save: (input: SaveRole.Input) => Promise<SaveRole.Output>;
}

export interface GetRoleByNameRepo {
  getByName: (name: string) => Promise<Role | undefined>;
}

export type RoleRepo = SaveRole;
