import React from "react";
import { ChevronRight, Sparkles, Scissors, Sun, Crown, Star } from 'lucide-react';
const ServiceItem = ({ service, isExpanded, onClick }) => {
  const icons = {
    "Hair Care Services": Scissors,
    "Skin Care Services": Sun,
    "Bridal Services": Crown
  };
  const Icon = icons[service.name] || Star;

  return (
    <div className={`group rounded-2xl bg-white transition-all duration-500 ${
      isExpanded ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'
    }`}>
      <div 
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                isExpanded ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                {service.name}
              </h2>
              <p className="mt-2 text-gray-600">
                {service.description}
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 text-violet-500 transition-transform duration-300 ${
              isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'
            }`} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 sm:p-8 bg-gray-50 rounded-b-2xl">
            {service.subServices.map((subService) => (
              <div 
                key={subService.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-violet-600 mb-4">
                  {subService.name}
                </h3>
                <ul className="space-y-3">
                  {subService.items.map((item, index) => (
                    <li 
                      key={index}
                      className="flex items-center group/item"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-200 group-hover/item:bg-violet-400 transition-colors mr-3" />
                      <span className="text-gray-600 group-hover/item:text-violet-600 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;