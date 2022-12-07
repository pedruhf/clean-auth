import { Permissions } from "@/domain/models";

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

export type RoleRepo = SaveRole;
