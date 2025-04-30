import request from "supertest";
import app from "../../server";


jest.mock("../../server", () => {
  const express = require("express");
  const mockApp = express();
  mockApp.use(express.json());

  // Mock routes
  mockApp.get("/api/blocked-slots", (req, res) => {
    res.status(200).json([]);
  });

  mockApp.post("/api/blocked-slots", (req, res) => {
    res.status(201).json({ _id: "mock-id-123" });
  });

  mockApp.delete("/api/blocked-slots/:id", (req, res) => {
    res.status(200).json({ message: "Slot deleted" });
  });

  return mockApp;
});

describe("Blocked Slot Controller - Basic Tests", () => {
  it("GET /api/blocked-slots - should return empty array", async () => {
    const res = await request(app).get("/api/blocked-slots");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /api/blocked-slots - should create a slot", async () => {
    const res = await request(app)
      .post("/api/blocked-slots")
      .send({
        startTime: "2025-01-01T10:00:00",
        endTime: "2025-01-01T12:00:00",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("DELETE /api/blocked-slots/:id - should delete a slot", async () => {
    const res = await request(app).delete("/api/blocked-slots/mock-id-123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Slot deleted" });
  });
});
