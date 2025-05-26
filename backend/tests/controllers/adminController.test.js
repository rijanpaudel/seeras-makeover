import request from "supertest";
import express from "express";
import {
  totalAppointment,
  totalUsers,
  totalCourses,
  recentAppointments,
} from "../../controllers/adminController.js";

import Appointment from "../../models/Appointments.js";
import User from "../../models/User.js";
import Course from "../../models/Course.js";


jest.mock("../../models/Appointments.js");
jest.mock("../../models/User.js");
jest.mock("../../models/Course.js");

const app = express();
app.use(express.json());
app.get("/appointments/total", totalAppointment);
app.get("/users/total", totalUsers);
app.get("/courses/total", totalCourses);
app.get("/appointments/recent", recentAppointments);

describe("Admin Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return total appointment count", async () => {
    Appointment.countDocuments.mockResolvedValue(10);

    const res = await request(app).get("/appointments/total");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(10);
  });

  test("should return total users and growth rate", async () => {
    User.countDocuments.mockResolvedValue(5);

    const res = await request(app).get("/users/total");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(5);
    expect(res.body.growthRate).toBe(12.5); 
  });

  test("should return total courses and completion rate", async () => {
    Course.countDocuments.mockImplementation((filter) => {
      if (filter && filter.status === "completed") {
        return Promise.resolve(5); 
      }
      return Promise.resolve(20); 
    });

    const res = await request(app).get("/courses/total");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(20);
    expect(res.body.completionRate).toBe(25);
  });

  test("should return recent appointments", async () => {
    Appointment.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(), 
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        {
          userId: { fullName: "Alice" },
          subServiceId: { name: "Massage" },
          appointmentDate: "2025-04-22T18:00:00Z",
        },
      ]),
    });

    const res = await request(app).get("/appointments/recent");

    expect(res.status).toBe(200);
    expect(res.body.appointments.length).toBe(1);
    expect(res.body.appointments[0].userId.fullName).toBe("Alice");
    expect(res.body.appointments[0].subServiceId.name).toBe("Massage");
  });

  test("should handle error in totalAppointment gracefully", async () => {
    Appointment.countDocuments.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/appointments/total");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching appointment count");
  });

  test("should handle error in totalUsers gracefully", async () => {
    User.countDocuments.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/users/total");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching active customers");
  });

  test("should handle error in totalCourses gracefully", async () => {
    Course.countDocuments.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/courses/total");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching ongoing courses");
  });

  test("should handle error in recentAppointments gracefully", async () => {
    Appointment.find.mockImplementation(() => ({
      populate: () => {
        throw new Error("DB error");
      },
    }));

    const res = await request(app).get("/appointments/recent");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching recent appointments");
  });
});
