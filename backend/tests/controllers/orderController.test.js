import {
  placeOrder,
  placeCodOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getPurchaseDetails,
} from "../../controllers/orderController.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Cart from "../../models/Cart.js";
import axios from "axios";

jest.mock("axios");
jest.mock("../../models/Order.js");
jest.mock("../../models/Product.js");
jest.mock("../../models/User.js");
jest.mock("../../models/Cart.js");
jest.mock("../../utils/emailService.js");

describe("Order Controller", () => {
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


    Order.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      }),
    });
  });

  describe("placeOrder", () => {
    it("should initiate payment", async () => {
      mockReq.body = {
        amount: 1000,
        purchase_order_id: "order123",
        extra: {
          orderData: {
            userId: "user123",
            items: [{ productId: "prod123" }],
            fullName: "Test User",
            address: "Test Address",
            phoneNumber: "1234567890",
          },
        },
      };

      Product.find.mockResolvedValue([{ _id: "prod123" }]);
      axios.post.mockResolvedValue({ data: { payment_url: "test-url" } });

      await placeOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("placeCodOrder", () => {
    it("should create COD order", async () => {
      mockReq.body = {
        userId: "user123",
        items: [{ productId: "prod123", quantity: 1 }],
        fullName: "Test User",
        address: "Test Address",
        phoneNumber: "1234567890",
      };

      Product.find.mockResolvedValue([{ _id: "prod123" }]);
      Order.prototype.save.mockResolvedValue({ _id: "order123" });
      Cart.findOne.mockResolvedValue({ items: [], save: jest.fn() });
      User.findById.mockResolvedValue({ email: "test@example.com" });

      await placeCodOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("getAllOrders", () => {
    it("should get all orders", async () => {
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([{ _id: "order1" }]),
        }),
      });

      await getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status", async () => {
      mockReq.params = { orderId: "order123" };
      mockReq.body = { status: "Shipped" };

      Order.findByIdAndUpdate.mockResolvedValue({
        _id: "order123",
        userId: "user123",
      });
      User.findById.mockResolvedValue({ email: "test@example.com" });

      await updateOrderStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("deleteOrder", () => {
    it("should delete order", async () => {
      mockReq.params = { orderId: "order123" };
      Order.findByIdAndDelete.mockResolvedValue(true);

      await deleteOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("getPurchaseDetails", () => {
    it("should get user purchases", async () => {
      mockReq.params = { userId: "user123" };
      Order.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([{ _id: "order1" }]),
      });

      await getPurchaseDetails(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
