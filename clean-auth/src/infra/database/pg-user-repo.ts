import { PrismaClient } from "@prisma/client";

import { User } from "@/domain/models";
import { GetUsersRepo, SaveUserRepo, UserRepo } from "@/data/gateways";
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
          email: email.toLowerCase(),
          password,
        },
      });
    } catch {
      throw new DbConnectionError();
    }
  }

  async getAll ({ page, limit }: GetUsersRepo.Input): Promise<GetUsersRepo.Output> {
    try {
      const users = await this.client.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          password: false
        },
      });
      return users as User[];
    } catch {
      throw new DbConnectionError();
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.client.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user) return;

      return user;
    } catch {
      throw new DbConnectionError();
    }
  }
}
