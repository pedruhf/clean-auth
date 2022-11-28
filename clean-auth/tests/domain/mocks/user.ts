import { faker } from "@faker-js/faker";

import { User } from "@/domain/models";

export const getUserMock = (): User => ({
  id: faker.datatype.number(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
})
