import { User } from "@/domain/models";
import { Login } from "@/domain/features";
import { EncryptComparer, TokenGenerator } from "@/data/gateways";
import { GetUserByEmailRepo } from "@/data/repos";

export class RemoteLogin {
  constructor(
    private readonly userRepo: GetUserByEmailRepo,
    private readonly encryptComparer: EncryptComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async execute({ email, password }: Login.Input): Promise<Login.Output> {
    const user = (await this.userRepo.getUserByEmail(email)) as User;
    const matchPassword = this.encryptComparer.compare(user.password, password);
    if (!matchPassword) {
      return;
    }
    const accessToken = this.tokenGenerator.generate(user.id);
    return {
      accessToken,
    };
  }
}
