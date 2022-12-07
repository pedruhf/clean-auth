export enum Roles {
  admin = "admin",
  developer = "developer",
  user = "user",
}

export enum Permissions {
  createAdmin = "create_admin",
  createDeveloper = "create_developer",
  listAll = "list_all",
}

export type Role = {
  id: number;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export const getAdminPermissions = () => [
  Permissions.createAdmin,
  Permissions.createDeveloper,
  Permissions.listAll,
];

export const getDeveloperPermissions = () => [
  Permissions.listAll,
];

export const getUserPermissions = () => [];
