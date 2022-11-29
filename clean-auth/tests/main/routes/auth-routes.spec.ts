import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { ExpressAppAdapter } from "@/infra/express/adapters"

describe("Auth Routes", () => {
  let app: any;

  beforeAll(async () => {
    app = ExpressAppAdapter.getInstance().client;
  });

  describe("POST /sign-up", () => {
    it("should return 201", async () => {
      const { statusCode } = await request(app).post("/api/sign-up").send({});
      expect(statusCode).toBe(201);
    });
  });
});
