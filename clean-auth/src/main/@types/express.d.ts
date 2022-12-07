import { Role } from "@/domain/models";

declare module Express {
  interface Request {
    locals?: {
      userId?: string;
      userRole?: Role;
    };
  }
}
