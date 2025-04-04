import React from 'react';
import { useNavigate } from 'react-router-dom'
import hometop from '../assets/home_top.jpg'

const HomeTop = () => {
  const navigate = useNavigate();

  const goToRoute = () => {
    navigate("/appointment");
  }
  
  return (
    <div className="relative w-full h-screen">
      <img
        src={hometop}
        alt="Unisex Parlour and Saloon"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="text-white max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 leading-tight">
            Unisex Parlour<br />and Saloon
          </h1>
          <p className="text-sm sm:text-base mb-6 max-w-md opacity-90 hidden sm:block">
            Experience premium beauty and grooming services in a luxurious setting. Our skilled professionals are dedicated to enhancing your natural beauty.
          </p>
          <button 
            className="px-4 sm:px-6 py-2 bg-pink-500 text-white font-medium rounded shadow hover:bg-pink-600 transition-colors duration-300"
            onClick={goToRoute}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTop;