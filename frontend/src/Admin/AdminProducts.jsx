import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", stock: "", image: null });

  // ✅ Fetch Products
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ Handle Input Change (for text fields)
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  // ✅ Add Product with Image Upload
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("image", newProduct.image); // Image File

    await axios.post("http://localhost:5000/api/products/add", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Product Added!");
    window.location.reload();
  };

  return (
    <div className="p-8 ml-64">
      <h1 className="text-2xl font-bold">Manage Products</h1>

      {/* ✅ Add Product Form */}
      <form className="mt-6 space-y-4" onSubmit={handleAddProduct}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 border" required />
        <input type="text" name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border" required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full p-2 border" required />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} className="w-full p-2 border" required />

        {/* ✅ Image Upload */}
        <input type="file" onChange={handleImageUpload} className="w-full p-2 border" required />

        <button type="submit" className="w-full bg-blue-500 text-white p-2">Add Product</button>
      </form>
    </div>
  );
};

export default AdminProducts;
