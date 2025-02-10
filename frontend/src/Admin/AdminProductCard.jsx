import React, { useState } from "react";
import axios from "axios";

function AdminProductCard({ _id, image, title, price, stock, onProductUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedPrice, setUpdatedPrice] = useState(price);
  const [updatedStock, setUpdatedStock] = useState(stock);
  const [message, setMessage] = useState("");

  // Handle Edit Product
  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/products/edit/${_id}`, {
        title: updatedTitle,
        price: updatedPrice,
        stock: updatedStock,
      });

      if (response.status === 200) {
        setMessage("Product updated successfully!");
        onProductUpdate(); // Refresh product list
      }
    } catch (error) {
      setMessage("Failed to update product.");
      console.error("Edit Error:", error);
    }
  };

  // ✅ Handle Delete Product
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/delete/${_id}`);

      if (response.status === 200) {
        setMessage("Product deleted successfully!");
        onProductUpdate(); // Refresh product list
      }
    } catch (error) {
      setMessage("Failed to delete product.");
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-md" />
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full p-2 border mt-2"
          />
          <input
            type="number"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            className="w-full p-2 border mt-2"
          />
          <input
            type="number"
            value={updatedStock}
            onChange={(e) => setUpdatedStock(e.target.value)}
            className="w-full p-2 border mt-2"
          />
          <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleEdit}>
            Save
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mt-2">{title}</h2>
          <p className="text-gray-600">Rs {price}</p>
          <p className="text-gray-600">Stock: {stock}</p>
          <button
            className="bg-yellow-500 text-white p-2 rounded mt-2 w-full"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      )}

      <button className="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={handleDelete}>
        Delete
      </button>

      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
}

export default AdminProductCard;
