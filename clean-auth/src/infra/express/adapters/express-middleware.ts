import { NextFunction, Request, Response } from "express";

import { Middleware } from "@/application/protocols";

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = { ...req.headers, ...req.locals };

    const { statusCode, data } = await middleware.handle(request);
    if (data instanceof Error) {
      return res.status(statusCode).json({ error: data.message });
    }

    req.locals = { ...req.locals, ...data };
    next();
  };
};
