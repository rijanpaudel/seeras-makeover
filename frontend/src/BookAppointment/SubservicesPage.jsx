import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SubservicePage = () => {
  const { mainService } = useParams();
  const navigate = useNavigate();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/sub-services/${mainService}`);
        setSubServices(response.data);
      } catch (error) {
        console.error("Error fetching sub-services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubServices();
  }, [mainService]);

  if (loading) {
    return <div className="text-center py-8">Loading sub-services...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Book your appointment now</h1>

      <h2 className="text-2xl font-medium mb-4">Select Service</h2>

      <div className="w-full">
        {subServices.length > 0 ? (
          subServices.map((service, index) => (
            <div key={service._subServiceId || `service-${index}`} className="border-b border-gray-300">
              <div className="flex justify-between items-center py-6">
                <div className="flex flex-col">
                  <h3 className="text-xl font-medium">{service.name}</h3>
                  <div className="flex items-center mt-2">
                    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor" />
                    </svg>
                    <span>{service.duration} mins</span>
                  </div>
                </div>
                <div className="text-xl font-medium">Rs {service.price}</div>
                <button
                  onClick={() => {
                    console.log(`Selected service: ${service.name}`);
                    // Navigate to DateTimeSelector with the selected service details
                    navigate(`/datetimeselector/${service._id}`, { state: { service } });
                  }}
                  className="px-10 py-2 text-pink-500 bg-white border border-pink-500 rounded-full hover:bg-pink-50 focus:outline-none"
                >
                  Select
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-8">No services available.</p>
        )}
      </div>

      <div className="w-full flex justify-center mt-16 mb-8">
        <button
          onClick={() => navigate("/appointment")}
          className="px-12 py-3 text-lg font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 focus:outline-none"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default SubservicePage;