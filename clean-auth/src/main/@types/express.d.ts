declare module Express {
  interface Request {
    locals?: {
      userId?: string;
      userRole?: string;
    };
  }
}
