import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import makeup from "../assets/makeover.png";
import facial from "../assets/facial.png";
import hair from "../assets/haircare.png";
import nails from "../assets/nailcare.png";

const AppointmentService = () => {
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  // Define your main services statically (you can later fetch these from backend if needed)
  const services = [
    { label: "Makeup", img: makeup },
    { label: "Facial", img: facial },
    { label: "Hair", img: hair },
    { label: "Nails", img: nails }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleNextClick = () => {
    if (selectedService) {
      // Navigate to the sub-services page with the selected service label in the URL
      navigate(`/appointment/subservice/${selectedService.label}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-36">
      <h1 className="text-3xl font-bold text-center mb-12">Book your appointment now</h1>
      <h2 className="text-xl font-semibold mb-8">Select Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => handleServiceSelect(service)}
            className={`p-8 rounded-lg flex flex-col items-center justify-center gap-4 
              ${selectedService?.label === service.label ? "bg-[#daedfe]" : "bg-white hover:bg-[#fdeaee]"}`}
          >
            <img src={service.img || "/placeholder.png"} alt={service.label} className="w-12 h-12 object-contain" />
            <span className="text-lg font-medium">{service.label}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleNextClick}
          className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
          disabled={!selectedService}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AppointmentService;
