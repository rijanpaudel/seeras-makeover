import React from "react";
import { ChevronRightIcon } from "lucide-react";

const SubService = ({ subService }) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-pink-600 mb-3">
        {subService.name}
      </h3>
      <ul className="space-y-2.5">
        {subService.items.map((item, index) => (
          <li 
            key={index}
            className="flex items-center text-gray-700 group"
          >
            <ChevronRightIcon className="w-4 h-4 text-pink-300 mr-2 transition-transform group-hover:translate-x-1" />
            <span className="group-hover:text-pink-600 transition-colors">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubService;