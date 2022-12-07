export enum Roles {
  admin = "admin",
  developer = "developer",
  user = "user",
}

export enum Permissions {
  createAdmin = "create_admin",
  makeAdmin = "make_admin",
  createDeveloper = "create_developer",
  makeDeveloper = "make_developer",
  listAllUsers = "list_all_users",
}

export type Role = {
  id: number;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export const getAdminPermissions = () => Object.values(Permissions);

export const getDeveloperPermissions = () => [
  Permissions.listAllUsers,
];

export const getUserPermissions = () => [];
