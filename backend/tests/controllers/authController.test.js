import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import app from "../../server.js";
import User from "../../models/User.js";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb");
  }
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Controller", () => {
  test("should return 400 if register fields are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
  });

  test("should send OTP on successful registration", async () => {
    const testUser = {
      fullName: "Test User",
      email: "test@example.com",
      phoneNumber: "9800000000",
      address: "Test Street",
      password: "password123",
      confirmPassword: "password123",
    };
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(200);
  });

  test("should return 400 on login if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "notfound@example.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(400);
  });

  test("should return 400 if password is incorrect", async () => {
    const hashedPassword = await bcrypt.hash("CorrectPass123", 10);
    const newUser = new User({
      fullName: "Test User",
      email: "exists@example.com",
      phoneNumber: "9812345678",
      address: "Lalitpur",
      password: hashedPassword,
    });
    await newUser.save();

    const res = await request(app).post("/api/auth/login").send({
      email: "exists@example.com",
      password: "WrongPassword",
    });

    expect(res.statusCode).toBe(400);
  });
});
