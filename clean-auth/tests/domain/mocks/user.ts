import { faker } from "@faker-js/faker";

import { User } from "@/domain/models";
import { getRoleMock } from "./role";

export const getUserMock = (): User => ({
  id: faker.datatype.number(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  role: getRoleMock(),
  password: faker.internet.password(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
})
