import {
  initiatePayment,
  verifyPayment,
} from "../../controllers/coursePaymentController.js";

jest.mock("../../models/Payment.js");
jest.mock("../../models/Enrollment.js");

describe("Payment Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("initiatePayment", () => {
    it("should return 400 if required fields are missing", async () => {
      await initiatePayment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Missing required payment fields",
      });
    });
  });

  describe("verifyPayment", () => {
    it("should return 400 if pidx is missing", async () => {
      await verifyPayment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing pidx" });
    });
  });
});
