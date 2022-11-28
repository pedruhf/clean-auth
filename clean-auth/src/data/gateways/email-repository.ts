import { User } from "@/domain/models";

export interface GetUserByEmailRepository {
  getUserByEmail: (email: string) => Promise<User | undefined>;
}
