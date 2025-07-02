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
    <div className="w-full px-4 py-8 md:py-12 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium">
          <span>Buy </span>
          <span className="text-pink-500">Beauty</span>
          <span> Products</span>
        </h2>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto px-4">
          Shop Premium Beauty Products for Skin and Hair from Top International
          Brands
        </p>
      </div>

      {/* Brand logos container */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8 md:mb-10">
        <div className="w-1/2 sm:w-1/3 md:w-1/5 flex justify-center">
          <img
            className="h-24 sm:h-28 md:h-32 lg:h-36 object-contain transition-transform hover:scale-105 duration-300"
            alt="Brillare"
            src={brillare}
          />
        </div>
        <div className="w-1/2 sm:w-1/3 md:w-1/5 flex justify-center">
          <img
            className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain transition-transform hover:scale-105 duration-300"
            alt="Lotus"
            src={lotus}
          />
        </div>
        <div className="w-1/2 sm:w-1/3 md:w-1/5 flex justify-center">
          <img
            className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain transition-transform hover:scale-105 duration-300"
            alt="Dermaco"
            src={dermaco}
          />
        </div>
        <div className="w-1/2 sm:w-1/3 md:w-1/5 flex justify-center">
          <img
            className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain transition-transform hover:scale-105 duration-300"
            alt="Kerabon"
            src={kerabon}
          />
        </div>
        <div className="w-1/2 sm:w-1/3 md:w-1/5 flex justify-center">
          <img
            className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain transition-transform hover:scale-105 duration-300"
            alt="Biobalance"
            src={biobalance}
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <button 
          className="bg-pink-500 text-white px-6 py-3 rounded-lg text-base sm:text-lg md:text-xl hover:bg-pink-600 transition-all duration-300 hover:scale-105"
          onClick={goToRoute}
        >
          Explore All Products
        </button>
      </div>
    </div>
  );
};

export default HomeProducts;