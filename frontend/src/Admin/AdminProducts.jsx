import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Upload, Loader2 } from "lucide-react";
import AdminProductCard from "./AdminProductCard";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      const products = response.data;

      //Fix image URL if they are relative
      const updatedProducts = products.map((product) => {
        if(product.image && product.image.startsWith("/uploads")){
          product.image = `http://localhost:5000${product.image}`;
        }
        return product;
      });

      setProducts(updatedProducts);
    } catch (error) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setNewProduct({ ...newProduct, image: file });
    setPreviewImage(URL.createObjectURL(file));
  }; //This function updates the image field in the newProduct state with the selected file

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!newProduct.image) {
      setError("Please choose an image for the product.");
      return;
    }
    setIsAddingProduct(true);

    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("brand", newProduct.brand);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);
      formData.append("image", newProduct.image);

      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Reset form and refresh products
      setNewProduct({ title: "", description: "", price: "", brand: "", category: "", stock: "", image: null });
      setPreviewImage(null);
      fetchProducts();
    } catch (error) {
      setError("Failed to add product.");
    } finally {
      setIsAddingProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Add and manage your product inventory</p>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={newProduct.brand || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={newProduct.category || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Haircare">Haircare</option>
                  <option value="Kerabon">Kerabon</option>
                  <option value="Brilliare">Brilliare</option>
                  <option value="Lotus">Lotus</option>
                </select>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="flex items-center">
                  <label className="w-full flex items-center justify-center p-3 border border-gray-300 border-dashed rounded-lg hover:border-pink-500 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Choose image</span>
                  </label>
                </div>
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingProduct}
              className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center"
            >
              {isAddingProduct ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {isAddingProduct ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <AdminProductCard
                key={product._id}
                {...product}
                onProductUpdate={fetchProducts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;