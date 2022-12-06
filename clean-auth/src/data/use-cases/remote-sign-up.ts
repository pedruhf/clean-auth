import { SignUp } from "@/domain/features";
import { Encrypter } from "@/data/gateways";
import { SaveUserRepo } from "@/data/repos";

export class RemoteSignUp implements SignUp {
  constructor(
    private readonly usersRepo: SaveUserRepo,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    name,
    email,
    password,
  }: SignUp.Input): Promise<SignUp.Output> {
    const encryptedPassword = this.encrypter.encrypt(password);
    await this.usersRepo.save({ name, email, password: encryptedPassword });
  }
}
