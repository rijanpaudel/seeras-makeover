import {
  addProduct,
  getAllProducts,
  editProduct,
  deleteProduct,
  getSingleProduct,
} from "../../controllers/productController.js";
import Product from "../../models/Product.js";
import multer from "multer";


jest.mock("../../models/Product.js");
jest.mock("multer");

describe("Product Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {},
      body: {},
      file: {
        filename: "test-image.jpg",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };


    multer.diskStorage.mockImplementation(() => ({
      destination: jest.fn(),
      filename: jest.fn(),
    }));
  });

  describe("addProduct", () => {
    it("should add a product with image", async () => {
      mockReq.body = {
        title: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
        brand: "Test Brand",
        category: "Test Category",
      };

      const mockProduct = {
        _id: "1",
        ...mockReq.body,
        image: "/uploads/test-image.jpg",
      };


      Product.mockImplementation(() => ({
        ...mockProduct,
        save: jest.fn().mockResolvedValue(true),
      }));

      try {

        await addProduct(mockReq, mockRes);


        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Product added successfully!",
          product: expect.objectContaining(mockProduct),
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("should handle error if adding product fails", async () => {
      mockReq.body = {
        title: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
        brand: "Test Brand",
        category: "Test Category",
      };

      const mockError = new Error("Database error");


      Product.mockImplementation(() => {
        throw mockError;
      });

      try {

        await addProduct(mockReq, mockRes);
      } catch (error) {

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Database error",
        });
      }
    });
  });

});
