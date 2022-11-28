import { SignUp } from "@/domain/features";
import { EmailInUseError } from "@/domain/errors";
import { Encrypter, GetUserByEmailRepository, SaveUserRepo } from "@/data/gateways";

export class RemoteSignUp implements SignUp {
  constructor(
    private readonly usersRepo: GetUserByEmailRepository & SaveUserRepo,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    name,
    email,
    password,
  }: SignUp.Input): Promise<SignUp.Output> {
    const foundedUser = await this.usersRepo.getUserByEmail(email);
    if (foundedUser) {
      throw new EmailInUseError();
    }

    const encryptedPassword = this.encrypter.encrypt(password);
    await this.usersRepo.save({ name, email, password: encryptedPassword });
  }
}
