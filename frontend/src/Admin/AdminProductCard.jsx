import React, { useState } from "react";
import axios from "axios";
import { Edit2, Trash2, Save, X, Loader2 } from "lucide-react";

const AdminProductCard = ({ _id, image, title, description, price, stock, onProductUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedPrice, setUpdatedPrice] = useState(price);
  const [updatedStock, setUpdatedStock] = useState(stock);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/products/edit/${_id}`, {
        title: updatedTitle,
        description: updatedDescription,
        price: updatedPrice,
        stock: updatedStock,
      });
      
      showMessage("Product updated successfully!", "success");
      setIsEditing(false);
      onProductUpdate();
    } catch (error) {
      showMessage("Failed to update product.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${_id}`);
      showMessage("Product deleted successfully!", "success");
      onProductUpdate();
    } catch (error) {
      showMessage("Failed to delete product.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {isEditing && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Product Title"
            />
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Description"
              rows="2"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Price"
              />
              <input
                type="number"
                value={updatedStock}
                onChange={(e) => setUpdatedStock(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Stock"
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm mb-2">{description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-pink-600">Rs {price}</span>
              <span className="text-sm text-gray-500">Stock: {stock}</span>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-3 p-2 rounded text-sm ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {isEditing ? (
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="w-full flex items-center justify-center p-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Product
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full flex items-center justify-center p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;