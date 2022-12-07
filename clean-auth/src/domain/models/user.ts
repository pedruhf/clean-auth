import { Role } from "@/domain/models";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
