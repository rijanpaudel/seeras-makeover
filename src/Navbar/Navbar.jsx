import React from 'react';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="container mx-5 px-2 py-2 flex items-center">
        <div className="flex items-center space-x-4 mr-20">
          <img
            src={logo}
            alt="Seeras Makover Logo"
            className="w-36"
          />
        </div>
        <ul className="flex items-center space-x-16 text-gray-800 font-medium mr-72 text-2xl">
          <li>
            <a href="#" className="hover:text-pink-600">
              Home
            </a>
          </li>
          <li className="relative">
            <a href="#" className="hover:text-pink-600 flex items-center">
              Services <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-pink-600">
              Book Appointment
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-pink-600">
              About us
            </a>
          </li>
          <li className="relative">
            <a href="#" className="hover:text-pink-600 flex items-center">
              Products <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-pink-600">
              Enroll Now
            </a>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-2xl text-pink-600 hover:text-pink-800">
            Login
          </a>
          <a
            href="#"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Sign up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
