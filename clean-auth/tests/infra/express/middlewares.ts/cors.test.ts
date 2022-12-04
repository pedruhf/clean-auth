import { describe, it } from "vitest";
import request from "supertest";
import { ExpressAppAdapter } from "@/infra/express/adapters";

const app = ExpressAppAdapter.getInstance().client;

describe("Cors Middlewares", () => {
  it("should setup origins, headers and methods to everywhere", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    })
    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*")
  });
});
