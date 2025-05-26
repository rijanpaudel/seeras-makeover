import express from "express";
import multer from "multer";
import path from "path";
import { addProduct, deleteProduct, editProduct, getAllProducts, getSingleProduct } from "../controllers/productController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/add", upload.single("image"), addProduct);

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
