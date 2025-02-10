import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //Save images in upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Unique filename
  }
});

const upload = multer({ storage });

// Add New Product
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, stock, image } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; //image path
    const newProduct = new Product({ title, description, price, stock, image: imageUrl });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

router.use("/uploads", express.static("uploads"));
// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Edit Product
router.put("/edit/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete Product
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

//Handle Wishlist

export default router;
