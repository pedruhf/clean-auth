import { describe, it } from "vitest";
import request from "supertest";
import { ExpressAppAdapter } from "@/infra/express/adapters";

const app = ExpressAppAdapter.getInstance().client;

describe("ContentType Middlewares", () => {
  it("should return default content type as json", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });
    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  it("should return xml content type when forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type("xml");
      res.send("");
    });
    await request(app)
      .get("/test_content_type_xml")
      .expect("content-type", /xml/);
  });
});
