import React from "react";
import { useNavigate } from 'react-router-dom';

const HomePink = ({
  firstTitle, 
  secondTitle, 
  thirdTitle, 
  paragraph, 
  buttonName, 
  mainImage,
  services = [],
  classes = []
}) => {
  const displayItems = services.length > 0 ? services : classes;
  const navigate = useNavigate();
  
  if(buttonName === "Book Appointment"){
    var goToRoute = () => {
      navigate("/appointment");
    }
  }
  else if(buttonName === "Enroll Now"){
    var goToRoute = () => {
      navigate("/enroll");
    }
  }
    
  return (
    <div className="bg-pink-100 py-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
      {/* Title Section */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold">
          {firstTitle} <span className="text-pink-500">{secondTitle}</span> {thirdTitle}
        </h1>
        <p className="mt-3 text-sm sm:text-base md:text-base lg:text-lg max-w-3xl mx-auto text-gray-700">
          {paragraph}
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={mainImage}
            alt="Home Appointment"
            className="rounded-lg shadow-md w-4/5 sm:w-3/4 lg:w-4/5 object-cover"
          />
        </div>

        {/* Services/Classes Section */}
        <div className={`flex flex-wrap justify-center lg:w-1/2 gap-4 sm:gap-6 md:gap-8 lg:gap-${displayItems.length === 4 ? '10' : '12'}`}>
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-center group hover:transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-24 lg:w-32 lg:h-24 object-contain"
              />
              <p className="text-sm sm:text-base md:text-base lg:text-lg font-medium group-hover:text-pink-500 transition-colors duration-300">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Button Section */}
      <div className="mt-8 sm:mt-10 text-center">
        <button 
          className="px-5 py-2 bg-pink-500 text-white text-sm sm:text-base font-medium rounded shadow hover:bg-pink-600 transition-colors duration-300"
          onClick={goToRoute}
        >
          {buttonName}
        </button>
      </div>
    </div>
  );
};

export default HomePink;