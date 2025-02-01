import React from "react";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";
import SubService from "./SubService";

const ServiceItem = ({ service, isExpanded, onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-center p-6 gap-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden">
            <img 
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {service.name}
            </h2>
            <p className="text-gray-600 line-clamp-2">
              {service.description}
            </p>
          </div>
          
          <div className="text-pink-500">
            {isExpanded ? (
              <ChevronDownIcon className="w-6 h-6 animate-rotate-down" />
            ) : (
              <ChevronRightIcon className="w-6 h-6 animate-rotate-right" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.subServices.map((subService) => (
              <SubService key={subService.id} subService={subService} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;