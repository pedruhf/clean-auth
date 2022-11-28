import express, { Express } from "express";
import { bodyParser, contentType, cors } from "@/infra/express/middlewares";

export class ExpressAppAdapter {
  private static instance?: ExpressAppAdapter;
  public client: Express;

  private constructor () {
    this.client = express();
    this.client.use(bodyParser);
    this.client.use(cors);
    this.client.use(contentType);
  }

  static getIstance(): ExpressAppAdapter {
    if (!this.instance) {
      this.instance = new ExpressAppAdapter();
    }

    return this.instance;
  }

  listen(port: number): void {
    this.client.listen(port, () => console.info(`Server running at http://localhost:${port}`));
  }
}
