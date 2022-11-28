import { PrismaClient } from "@prisma/client";

import { User } from "@/domain/models";
import { SaveUserRepo, UserRepo } from "@/data/gateways";

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
    this.client.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = this.client.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
