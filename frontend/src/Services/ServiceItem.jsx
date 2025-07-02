import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceItem = ({ service, isExpanded, onClick }) => {
  const [subServices, setSubServices] = useState([]);
  
  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/sub-services/${service.name}`);
        setSubServices(response.data);  // Setting the fetched sub-services in state
      } catch (error) {
        console.error("Error fetching sub-services:", error);
      }
    };

    if (isExpanded) {
      fetchSubServices();  // Fetch sub-services only when the service is expanded
    }
  }, [isExpanded, service.name]);

  return (
    <div className="border p-6 rounded-xl shadow-lg bg-white">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">{service.name}</h3>
        <button onClick={onClick} className="text-pink-500 text-lg">
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>
      <p className="text-gray-600 mt-2">{service.description}</p>

      {/* Show Sub-Services when the service is expanded */}
      {isExpanded && (
        <div className="mt-4">
          {subServices.length === 0 ? (
            <p>No sub-services available for this service.</p>
          ) : (
            subServices.map((subService) => (
              <div key={subService._id} className="mb-4">
                <h4 className="text-xl font-medium text-gray-800">{subService.name}</h4>
                <ul className="list-disc pl-6">
                  {subService.items.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
