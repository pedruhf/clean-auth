import { Permissions } from "@/domain/models";

export namespace CreateRole {
  export type Input = {
    name: string;
    permissions: Permissions[];
  };

  export type Output = void;
}

export interface CreateRole {
  execute: (input: CreateRole.Input) => Promise<CreateRole.Output>;
}
