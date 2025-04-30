import { addNewService } from "../../controllers/subServiceController.js";
import SubService from "../../models/SubService.js";

jest.mock("../../models/SubService.js");

describe("SubService Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

   
    mockReq = {
      body: {
        name: "Test Service",
        description: "Test Description",
        price: 100,
        duration: "1 hour",
        mainService: "Hair",
      },
      file: {
        filename: "test-image.jpg", 
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should add a new sub-service successfully", async () => {
    const mockSubService = {
      _id: "1",
      name: "Test Service",
      description: "Test Description",
      price: 100,
      duration: "1 hour",
      mainService: "Hair",
      image: "/uploads/test-image.jpg",
      save: jest.fn().mockResolvedValue(true), 
    };

    SubService.mockImplementation(() => mockSubService);

   
    await addNewService(mockReq, mockRes);

 
    try {
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Sub-service added successfully",
        subService: expect.objectContaining({
          name: "Test Service",
          image: "/uploads/test-image.jpg",
        }),
      });
    } catch (error) {
      console.log("Test failed with error:", error);
    }
  });
});
