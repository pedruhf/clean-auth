import { describe, it } from "vitest";
import request from "supertest";
import { ExpressAppAdapter } from "@/infra/express/adapters";

const app = ExpressAppAdapter.getInstance().client;

describe("BodyParser Middlewares", () => {
  it("should parse body as json", async () => {
    app.get("/test_cors", (req, res) => {
      res.send(req.body);
    })
    await request(app)
      .get("/test_cors")
      .send({ name: "Pedro Freitas" })
      .expect({ name: "Pedro Freitas" });
  });
});
