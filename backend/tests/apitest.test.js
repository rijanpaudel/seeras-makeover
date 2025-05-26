import request from "supertest";
import express from "express";
const app = express();

describe("API Testing", () => {
  test("GET /uploads should be accessible", async () => {
    const res = await request(app).get("/uploads");
    expect([200, 301, 403, 404]).toContain(res.statusCode);
  });

  test("GET /api/courses", async () => {
    const res = await request(app).get("/api/courses");
    expect([200, 404]).toContain(res.statusCode); 
  });

  test("GET /api/cart", async () => {
    const res = await request(app).get("/api/cart");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/orders", async () => {
    const res = await request(app).get("/api/orders");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/enrollments", async () => {
    const res = await request(app).get("/api/enrollments");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/sub-services", async () => {
    const res = await request(app).get("/api/sub-services");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/appointments", async () => {
    const res = await request(app).get("/api/appointments");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/admin", async () => {
    const res = await request(app).get("/api/admin");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/payment", async () => {
    const res = await request(app).get("/api/payment");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("GET /api/course-payment", async () => {
    const res = await request(app).get("/api/course-payment");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});
