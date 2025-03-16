import express from "express";
import { addProduct, deleteProduct, editProduct, getAllProducts, getSingleProduct } from "../controllers/productController.js";

const router = express.Router();

// Add New Product
router.post("/add", addProduct);

router.use("/uploads", express.static("uploads"));
// Get All Products
router.get("/", getAllProducts);

// Edit Product
router.put("/edit/:id", editProduct);

// Delete Product
router.delete("/delete/:id", deleteProduct);

// Get a Single Product by ID
router.get("/:id", getSingleProduct);


export default router;
