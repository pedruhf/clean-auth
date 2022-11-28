import express, { Express, Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";

import { bodyParser, contentType, cors } from "@/infra/express/middlewares";

export class ExpressAppAdapter {
  private static instance?: ExpressAppAdapter;
  public client: Express;

  private constructor() {
    this.client = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  static getInstance(): ExpressAppAdapter {
    if (!this.instance) {
      this.instance = new ExpressAppAdapter();
    }

    return this.instance;
  }

  listen(port: number): void {
    this.client.listen(port, () =>
      console.info(`Server running at http://localhost:${port}`)
    );
  }

  setupMiddlewares(): void {
    this.client.use(bodyParser);
    this.client.use(cors);
    this.client.use(contentType);
  }

  setupRoutes(): void {
    const router = Router();
    this.client.use("/api", router);
    readdirSync(join(__dirname, "../../../main/routes")).map(async (file) => {
      if (!file.endsWith(".map")) {
        (await import(`../../../main/routes/${file}`)).default(router);
      }
    });
  }
}
