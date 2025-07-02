import React from 'react';
import { useNavigate } from 'react-router-dom'
import hometop from '../assets/home_top.jpg'

const HomeTop = () => {
  const navigate = useNavigate();

  const goToRoute = () => {
    navigate("/appointment");
  }
  
  return (
    <div className="relative w-full min-h-screen">
      <img
        src={hometop}
        alt="Unisex Parlour and Saloon"
        className="w-full h-full object-cover absolute inset-0"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-white w-full max-w-lg space-y-4 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Unisex Parlour<br className="md:block" />and Saloon
          </h1>
          <p className="text-sm sm:text-base max-w-md opacity-90 hidden sm:block">
            Experience premium beauty and grooming services in a luxurious setting. Our skilled professionals are dedicated to enhancing your natural beauty.
          </p>
          <button 
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-pink-500 text-white text-sm sm:text-base font-medium rounded shadow hover:bg-pink-600 transition-colors duration-300 transform hover:scale-105"
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