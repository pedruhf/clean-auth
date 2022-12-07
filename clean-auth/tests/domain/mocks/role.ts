import { faker } from "@faker-js/faker";

import { Permissions } from "@/domain/models";
import { Role } from "@prisma/client";

export const getRoleMock = (): Role => ({
  id: faker.datatype.number(),
  name: faker.name.fullName(),
  permissions: faker.helpers.arrayElements(Object.values(Permissions)),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
});
