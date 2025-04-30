import {
  getCartByUserId,
  addToCart,
  removeItemFromCart,
  clearCart,
} from "../../controllers/cartController.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";


jest.mock("../../models/Cart.js");
jest.mock("../../models/Product.js");

describe("Cart Controller", () => {
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

  describe("getCartByUserId", () => {
    it("should return empty cart if no cart exists", async () => {
      mockReq.params.userId = "validUserId123";
      Cart.findOne.mockResolvedValue(null);

      await getCartByUserId(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("addToCart", () => {
    it("should add item to cart", async () => {
      mockReq.body = {
        userId: "validUserId123",
        productId: "validProductId123",
        quantity: 1,
      };

      Product.findById.mockResolvedValue({ _id: "validProductId123" });
      Cart.findOne.mockResolvedValue({
        userId: "validUserId123",
        items: [],
        save: jest.fn().mockResolvedValue(true),
      });

      await addToCart(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("removeItemFromCart", () => {
    it("should remove item from cart", async () => {
      mockReq.params = {
        userId: "validUserId123",
        productId: "validProductId123",
      };

      Cart.findOneAndUpdate.mockResolvedValue({
        userId: "validUserId123",
        items: [],
      });

      await removeItemFromCart(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("clearCart", () => {
    it("should clear all items from cart", async () => {
      mockReq.params.userId = "validUserId123";

      Cart.findOne.mockResolvedValue({
        userId: "validUserId123",
        items: [],
        save: jest.fn().mockResolvedValue(true),
      });

      await clearCart(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
