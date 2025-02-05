import * as React from "react";
import { useAuth } from "../Context/AuthContext";

function ProductCard({ image, wishlistIcon, title, price }) {
  const { user } = useAuth();
  const [message, setMessage] = React.useState(""); // State for showing login warning

  // Handle button clicks
  const handleClick = (action) => {
    if (!user) {
      setMessage(`You must be logged in to ${action}.`); // Show warning message
      setTimeout(() => setMessage(""), 3000); // Remove message after 3 seconds
    } else {
      // Perform actual add to cart / buy action
      console.log(`${action} clicked`); // Replace this with actual logic
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="pt-3.5 pr-3 pb-16 pl-20 bg-gray-200 rounded-3xl max-md:pl-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src={image}
              alt={title}
              className="object-contain grow mt-11 w-full aspect-[0.93] max-md:mt-10 max-md:-mr-4"
            />
          </div>
          <div className="flex flex-col ml-5 w-[19%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src={wishlistIcon}
              alt="Wishlist icon"
              className="object-contain shrink-0 w-20 aspect-[0.89] max-md:mt-3.5"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start pr-3.5 pl-1.5 mt-5 w-full text-3xl max-md:max-w-full">
        <div className="font-medium text-black">{title}</div>
        <div className="mt-5 font-bold text-black">Rs {price}</div>
        <div className="flex gap-5 justify-between self-stretch mt-10 max-md:max-w-full">
          {/* Add to Cart Button */}
          <button
            className="overflow-hidden px-6 py-4 text-pink-500 bg-white border border-pink-500 border-solid rounded-[100px] max-md:px-5"
            onClick={() => handleClick("add to cart")}
          >
            Add to cart
          </button>

          {/* Buy Now Button */}
          <button
            className="overflow-hidden px-11 py-4 text-white bg-pink-500 rounded-[100px] max-md:px-5"
            onClick={() => handleClick("buy")}
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
