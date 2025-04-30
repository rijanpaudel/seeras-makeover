import {
  addCourse,
  editCourse,
  deleteCourse,
  getAllCourse,
} from "../../controllers/courseController.js";
import Course from "../../models/Course.js";

jest.mock("../../models/Course.js");

describe("Course Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("addCourse", () => {
    it("should add a course", async () => {
      const mockCourse = {
        _id: "1",
        courseTitle: "Test Course",
        save: jest.fn().mockResolvedValue(true),
      };
      Course.mockReturnValue(mockCourse);

      mockReq.body = {
        courseTitle: "Test Course",
        courseDescription: "Test Description",
        courseDuration: "10 hours",
        coursePrice: 100,
        modules: [],
      };

      await addCourse(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("editCourse", () => {
    it("should edit a course", async () => {
      const mockCourse = {
        _id: "1",
        courseTitle: "Updated Course",
      };
      Course.findByIdAndUpdate.mockResolvedValue(mockCourse);

      mockReq.params.id = "1";
      mockReq.body = {
        courseTitle: "Updated Course",
      };

      await editCourse(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("deleteCourse", () => {
    it("should delete a course", async () => {
      Course.findByIdAndDelete.mockResolvedValue(true);

      mockReq.params.id = "1";

      await deleteCourse(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("getAllCourse", () => {
    it("should get all courses", async () => {
      const mockCourses = [
        { _id: "1", courseTitle: "Course 1" },
        { _id: "2", courseTitle: "Course 2" },
      ];
      Course.find.mockResolvedValue(mockCourses);

      await getAllCourse(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCourses);
    });
  });
});
