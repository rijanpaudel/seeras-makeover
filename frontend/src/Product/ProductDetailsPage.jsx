import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1); // Quantity state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/${id}`);
        const productData = response.data;

        // Handle image URL
        if (productData.image?.startsWith("/uploads")) {
          productData.image = `${BASE_URL}${productData.image}`;
        }

        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/cart/${user._id}`);
      console.log("Updated Cart Data:", response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user || !user._id) {
      alert("You must be logged in to add to cart");
      return;
    }
  
    if (!product || !product._id) {
      alert("Invalid product data");
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/cart/add`, {
        userId: user._id,
        productId: product._id,
        quantity: quantity,
      });
  
      if (response.status === 200) {
        alert("Product added to cart!");
        await fetchCart();
      } else {
        alert("Error adding to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };
  

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("You must be logged in to proceed.");
      return;
    }
  
    navigate("/checkout", {
      state: { 
        product:{ _id, image, title, price }, 
        quantity: quantity 
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-56">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Product Image */}
        <div className="md:w-1/2">
          <div className="relative bg-gray-200 rounded-3xl p-8">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="md:w-1/2">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-black">{product.title}</h1>
            <p className="text-xl text-gray-700">{product.description}</p>
            <p className="text-3xl font-bold text-black">Rs {product.price}</p>

            {/* Quantity Control */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={decrementQuantity}
                className="px-4 py-2 text-white bg-gray-600 rounded-full hover:bg-gray-700 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="px-4 py-2 text-white bg-gray-600 rounded-full hover:bg-gray-700 transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-8 py-4 text-pink-500 bg-white border-2 border-pink-500 rounded-full hover:bg-pink-50 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-8 py-4 text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
              >
                Buy Now
              </button>
            </div>

            {message && <div className="mt-4 text-red-500 text-center">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
