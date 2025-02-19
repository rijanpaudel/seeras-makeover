import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For fetching data from the backend
import ServiceHeader from './ServiceHeader';
import ServiceItem from './ServiceItem';

const Services = () => {
  const [expandedService, setExpandedService] = useState(null);
  const [categorizedServices, setCategorizedServices] = useState({});

  // Fetch services data from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sub-services');
        const services = response.data;
        
        const grouped = services.reduce((acc, subService) => {
          const category = subService.mainService;
          if(!acc[category]) acc[category] = [];
          acc[category].push(subService);
          return acc;
        }, {});

        setCategorizedServices(grouped);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceHeader />
      
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="space-y-6">
          {/* Display each service category dynamically */}
          {Object.entries(categorizedServices).map(([mainService, subServices]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-3xl font-semibold text-gray-800">{category} Services</h2>

              {categorizedServices[category].map((service) => (
                <ServiceItem
                  key={mainService}
                  service={mainService}
                  subService = {subServices}
                  isExpanded={expandedService === subServices}
                  onClick={() =>
                    setExpandedService(
                      expandedService === mainService ? null : mainService
                    )
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
