const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");

describe("Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new citizen", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test Eugene",
        email: "test@example.com",
        phone: "+250789693623",
        password: "eugene123",
        sector: "Kicukiro",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should fail with invalid phone number", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test Ndizihiwe",
        email: "test2@example.com",
        phone: "123456", // Invalid
        password: "password123",
        sector: "Kicukiro",
      });

      expect(res.statusCode).toEqual(400);
    });
  });
});
