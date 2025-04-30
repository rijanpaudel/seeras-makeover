import { bookAppointment } from "../../controllers/appointmentController.js";
import Appointment from "../../models/Appointments.js";
import User from "../../models/User.js";
import BlockedSlot from "../../models/BlockedSlot.js";
import sendEmail from "../../utils/emailService.js";

jest.mock("../../models/Appointments.js");
jest.mock("../../models/User.js");
jest.mock("../../models/BlockedSlot.js");
jest.mock("../../utils/emailService.js");

describe("bookAppointment", () => {
  const mockRequest = {
    body: {
      userId: "6631c93b9bfcf1d15c44e5e0",
      subServiceId: "6631c93b9bfcf1d15c44e5e1",
      appointmentDate: "2025-05-01",
      appointmentTime: "10:30 AM",
      notes: "Test note",
    },
  };

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should return 400 if required fields are missing", async () => {
    const req = { body: { ...mockRequest.body, userId: null } };
    const res = mockResponse();

    await bookAppointment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required fields",
    });
  });

  it("should return 400 for invalid ObjectIds", async () => {
    const req = { body: { ...mockRequest.body, userId: "invalid-id" } };
    const res = mockResponse();

    await bookAppointment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid user or sub service ID format",
    });
  });

  it("should return 400 if slot already booked", async () => {
    Appointment.findOne.mockResolvedValueOnce({}); 
    const res = mockResponse();

    await bookAppointment(mockRequest, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "This time slot is already booked. Please select a different time.",
    });
  });

  it("should return 400 if time slot is blocked", async () => {
    Appointment.findOne.mockResolvedValueOnce(null);
    BlockedSlot.findOne.mockResolvedValueOnce({}); 
    const res = mockResponse();

    await bookAppointment(mockRequest, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "This time slot is not available for booking. Please select a different time.",
    });
  });

  it("should book successfully and send email", async () => {
    Appointment.findOne.mockResolvedValueOnce(null);
    BlockedSlot.findOne.mockResolvedValueOnce(null);
    Appointment.prototype.save = jest.fn().mockResolvedValue({});
    User.findById.mockResolvedValue({
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
    });

    const res = mockResponse();

    await bookAppointment(mockRequest, res);

    expect(Appointment.prototype.save).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledTimes(2); 
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Appointment Book Successfully",
      })
    );
  });
});
