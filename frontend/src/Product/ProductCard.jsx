import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useToast } from '../Context/ToastContext';
import axios from "axios";

function ProductCard({ _id, image, title, price, brand, category }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState(""); // State for showing login warning
  const { showToast } = useToast();

  //Add to cart
  const handleAddToCart = async () => {
    if (!user || !user._id) {
      showToast("You must be logged in to add to cart.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/cart/add`, {
        userId: user._id,
        productId: _id,
        quantity: 1,
      });

      if (response.status === 200) {
        showToast("Product added to cart");
        //await fetchCart();
      } else {
        showToast("Error adding to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast(error.response?.data?.message || "Failed to add to cart");
    }
  };

  //Buy now
  const handleBuyNow = () => {
    if (!user) {
      showToast("You must be logged in to proceed.");
      return;
    }

    navigate("/checkout", {
      state: {
        product: { _id, image, title, price },
        quantity: 1
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Link to={`/products/product/${_id}`}>
        <div className="pt-3.5 pr-3 pb-16 pl-20 bg-gray-200 rounded-3xl max-md:pl-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[81%] max-md:ml-0 max-md:w-full relative">
              {/* Product Image */}
              <img
                src={image}
                alt={title}
                className="object-contain grow mt-11 w-full aspect-[0.93] max-md:mt-10 max-md:-mr-4"
              />
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-col items-start pr-3.5 pl-1.5 mt-5 w-full text-3xl max-md:max-w-full">
        <div className="font-medium text-black">{title}</div>
        <div className="mt-5 font-bold text-black">Rs {price}</div>
        <div className="mt-2 text-sm text-gray-500">
          <span>Brand: {brand}</span> • <span>Category: {category}</span>
        </div>

        <div className="flex gap-5 justify-between self-stretch mt-10 max-md:max-w-full">
          {/* Add to Cart Button */}
          <button
            className="overflow-hidden px-6 py-4 text-pink-500 bg-white border border-pink-500 border-solid rounded-[100px] max-md:px-5"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>

          {/* Buy Now Button */}
          <button
            className="overflow-hidden px-11 py-4 text-white bg-pink-500 rounded-[100px] max-md:px-5"
            onClick={handleBuyNow}
          >
            Buy now
          </button>
        </div>

        {/* Warning Message */}
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default ProductCard;
