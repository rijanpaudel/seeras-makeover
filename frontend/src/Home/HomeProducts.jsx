import React from "react";
import { useNavigate } from "react-router-dom";
import brillare from '../assets/brillare.jpg'
import lotus from '../assets/lotus.webp'
import dermaco from '../assets/dermaco.webp'
import kerabon from '../assets/kerabon.jpeg'
import biobalance from '../assets/biobalance.png'

const HomeProducts = () => {
  const navigate = useNavigate();
  const goToRoute = () => {
    navigate("/products")
  }
  return (
    <div className="w-full px-4 py-12 md:py-16 max-w-7xl mx-auto">
      <div className="text-center space-y-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-medium">
          <span>Buy </span>
          <span className="text-pink-500">Beauty</span>
          <span> Products</span>
        </h2>

        <p className="text-xl md:text-3xl font-medium max-w-4xl mx-auto px-4">
          Shop Premium Beauty Products for Skin and Hair from Top International
          Brands
        </p>
      </div>

      {/* Brand logos container */}
      <div className="flex justify-center items-center mb-12">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 flex justify-center">
          <img
            className="h-36 md:h-50 lg:h-50 object-contain"
            alt="Brillare"
            src={brillare}
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex justify-center">
          <img
            className="h-24 md:h-32 lg:h-40 object-contain"
            alt="Lotus"
            src={lotus}
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex justify-center">
          <img
            className="h-24 md:h-32 lg:h-40 object-contain"
            alt="Dermaco"
            src={dermaco}
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex justify-center">
          <img
            className="h-24 md:h-32 lg:h-40 object-contain"
            alt="Kerabon"
            src={kerabon}
          />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex justify-center">
          <img
            className="h-24 md:h-32 lg:h-40 object-contain"
            alt="Biobalance"
            src={biobalance}
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <button className="bg-pink-500 text-white px-8 py-4 rounded-lg text-xl md:text-2xl hover:bg-pink-600 transition-colors"
        onClick={goToRoute}>
          Explore All Products
        </button>
      </div>
    </div>
  );
};

export default HomeProducts;