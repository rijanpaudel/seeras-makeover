import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const ServiceCard = ({ title, duration, price, onSelect }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full border-b border-gray-300">
      <div className="flex flex-wrap justify-between items-center py-6">
        <div className="flex flex-col">
          <div className="text-xl font-medium">{title}</div>
          <div className="flex items-center mt-2">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
            </svg>
            <span className="text-base">{duration} mins</span>
          </div>
        </div>
        <div className="text-xl font-medium">{price}</div>
        <button 
          className="px-10 py-2 text-lg text-pink-500 bg-white border border-pink-500 rounded-full hover:bg-pink-50 focus:outline-none"
          aria-label={`Select ${title} service`}
        >
          Select
        </button>
      </div>
    </div>
  );
};