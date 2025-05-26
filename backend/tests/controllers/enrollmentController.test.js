import request from "supertest";
import express from "express";
import router from "../../routes/enrollmentRoutes.js";  

const app = express();
app.use(express.json());
app.use("/api/enrollments", router);

describe("Enrollment Endpoints", () => {


  it("should return 404 for non-existent single enrollment", async () => {
    const res = await request(app).get(
      "/api/enrollments/607f1f77bcf86cd799439011"
    );
    expect(res.statusCode).toBe(404);
  });

});
