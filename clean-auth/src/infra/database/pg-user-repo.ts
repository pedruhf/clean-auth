import { PrismaClient } from "@prisma/client";

import { User } from "@/domain/models";
import { SaveUserRepo, UserRepo } from "@/data/gateways";
import { DbConnectionError } from "@/infra/errors";

export class PgUserRepo implements UserRepo {
  private static instance?: PgUserRepo;
  private client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient();
  }

  static getInstance(): PgUserRepo {
    if (!this.instance) {
      this.instance = new PgUserRepo();
    }
    return this.instance;
  }

  async save({ name, email, password }: SaveUserRepo.Input): Promise<void> {
    try {
      await this.client.user.create({
        data: {
          name,
          email,
          password,
        },
      });
    } catch {
      throw new DbConnectionError();
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.client.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return;

      return user;
    } catch {
      throw new DbConnectionError();
    }
  }
}
