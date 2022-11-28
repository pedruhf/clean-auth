import { Request, Response } from "express";

import { Controller } from "@/application/controllers";
import { HttpRequest } from "@/application/helpers";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: HttpRequest = {
      body: req.body,
      headers: req.headers,
      params: req.params,
    };

    const { statusCode, data } = await controller.handle(request);
    if (data instanceof Error) {
      return res.status(statusCode).json({
        error: data.message,
      });
    }

    return res.status(statusCode).json(data);
  };
};
