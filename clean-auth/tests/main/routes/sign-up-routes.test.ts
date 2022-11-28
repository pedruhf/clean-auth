import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { ExpressAppAdapter } from "@/infra/express/adapters";

describe("Auth Routes", () => {
  let app: ExpressAppAdapter;

  beforeAll(() => {
    app = ExpressAppAdapter.getIstance();
  });

  describe("POST /sign-up", () => {
    it("should 201 on sign up", async () => {
      const { statusCode } = await request(app.client).post("/api/sign-up").send({
        name: "Pedro Freitas",
      });

      expect(statusCode).toBe(201);
    });
  });
});
