import React from "react"
import bridal from "../../assets/bridal.png";
import facial from "../../assets/facial.png";
import makeover from "../../assets/makeover.png";
import haircare from "../../assets/haircare.png";
import nailcare from "../../assets/nailcare.png";
import haircuttraining from "../../assets/haircuttraining.png";

const services = [
  {
    img: bridal,
    label: "Bridal",
  },
  {
    img: facial,
    label: "Facial",
  },
  {
    img: makeover,
    label: "Makeup",
  },
  {
    img: haircare,
    label: "Hair Care",
  },
  {
    img: nailcare,
    label: "Nails",
  },
  {
    img: haircuttraining,
    label: "Hair Cut",
  },
];

export default function AppointmentService() {
  const [selectedService, setSelectedService] = React.useState("")

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-12">Book your appointment now</h1>

      {/* Service Selection */}
      <h2 className="text-xl font-semibold mb-8">Select Service</h2>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => setSelectedService(service.label)}
            className={`p-8 rounded-lg flex flex-col items-center justify-center gap-4
              ${selectedService === service.label ? "bg-[#daedfe]" : "bg-white hover:bg-[#fdeaee]"}`}
          >
            <img src={service.img || "/placeholder.png"} alt={service.label} className="w-12 h-12 object-contain" />
            <span className="text-lg font-medium">{service.label}</span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 
            transition-colors disabled:opacity-50"
          disabled={!selectedService}
        >
          Next
        </button>
      </div>
    </div>
  )
}

