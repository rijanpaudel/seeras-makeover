import React from "react";
import { useNavigate } from "react-router-dom";

const RecommendedCard = ({ item, type }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {type === "product" ? item.title : item.name}
        </h3>
        {type === "product" && item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-40 object-contain mb-2"
          />
        )}
        <p className="text-sm text-gray-600">
          {type === "product" ? item.description : item.description}
        </p>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {type === "product" ? (
          <>
            <p>Brand: {item.brand}</p>
            <p>Price: Rs {item.price}</p>
          </>
        ) : (
          <>
            <p>Duration: {item.duration}</p>
            <p>Price: Rs {item.price}</p>
          </>
        )}
      </div>
      <button
        onClick={() =>
          navigate(type === "product" ? `/products/${item._id}` : `/services/${item._id}`)
        }
        className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
      >
        {type === "product" ? "View Product" : "Book Now"}
      </button>
    </div>
  );
};

export default RecommendedCard;
