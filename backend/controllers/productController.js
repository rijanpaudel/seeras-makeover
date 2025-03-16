import Product from "../models/Product.js";
import multer from "multer";
import path from "path";


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
export const addProduct = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading image", error: err });
      }

      // Ensure file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }
      const { title, description, price, stock, brand, category, image } = req.body;
      const imageUrl = `/uploads/${req.file.filename}`;
      const newProduct = new Product({ title, description, price: Number(price), stock: Number(price), brand, category, image: imageUrl });
      await newProduct.save();
      res.status(201).json({ message: "Product added successfully!", product: newProduct });
    });
  }

  catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Edit Product
export const editProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Get a Single Product by ID
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Use the ID from the request params
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

