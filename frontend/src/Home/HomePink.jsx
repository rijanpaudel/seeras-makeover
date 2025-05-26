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
    <div className="bg-pink-100 py-10 px-36">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          {firstTitle} <span className="text-pink-500">{secondTitle}</span> {thirdTitle}
        </h1>
        <p className="mt-4 text-base md:text-lg lg:text-xl max-w-4xl mx-auto">
          {paragraph}
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-center gap-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src={mainImage}
            alt="Home Appointment"
            className="rounded-lg shadow-md w-4/6"
          />
        </div>

        {/* Services/Classes Section */}
        <div className={`flex flex-wrap justify-center lg:w-1/2 gap-${displayItems.length === 4 ? '20' : '28'}`}>
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-center"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-36 h-24 md:w-36 md:h-28 object-contain"
              />
              <p className="text-lg font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button Section */}
      <div className="mt-10 text-center">
      <button className="px-6 py-2 bg-pink-500 text-white font-medium rounded shadow"
          onClick={goToRoute}>
            {buttonName}
          </button>
      </div>
    </div>
  );
};

export default HomePink;