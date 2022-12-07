import { SaveRole } from "@/data/repos";
import { CreateRole } from "@/domain/features";

export class DbCreateRole implements CreateRole {
  constructor(private readonly roleRepo: SaveRole) {}

  async execute({ name, permissions }: CreateRole.Input): Promise<CreateRole.Output> {
    await this.roleRepo.save({ name, permissions });
  }
}
