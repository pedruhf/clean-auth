import { PrismaClient } from "@prisma/client";

import { RoleRepo, SaveRole } from "@/data/repos";
import { DbConnectionError } from "@/infra/errors";

export class PgRoleRepo implements RoleRepo {
  private static instance?: PgRoleRepo;
  private client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient();
  }

  static getInstance(): PgRoleRepo {
    if (!this.instance) {
      this.instance = new PgRoleRepo();
    }
    return this.instance;
  }

  async save({ name, permissions }: SaveRole.Input): Promise<void> {
    try {
      await this.client.role.create({
        data: {
          name,
          permissions,
        },
      });
    } catch {
      throw new DbConnectionError();
    }
  }
}
