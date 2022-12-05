import { GetUsers } from "@/domain/features";
import { GetUsersRepo } from "@/data/gateways";

export class DbGetUsers implements GetUsers {
  constructor (private readonly userRepo: GetUsersRepo) {}

  async execute({ page, limit }: GetUsers.Input): Promise<GetUsers.Output> {
    const users = await this.userRepo.getAll({ page, limit });
    return users;
  }
}
