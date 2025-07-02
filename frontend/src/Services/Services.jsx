import React, { useState, useEffect } from "react";
import axios from "axios";
import ServiceHeader from "./ServiceHeader";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";


const Services = () => {
  const [categorizedServices, setCategorizedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [recommendedServices, setRecommendedServices] = useState([]);
  const { user } = useAuth();


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/sub-services`);
        const services = response.data;

        // Group services by mainService using display names
        const groups = services.reduce((acc, service) => {
          let displayName = "";
          switch (service.mainService) {
            case "Hair":
              displayName = "Hair Service";
              break;
            case "Skin":
              displayName = "Skin Service";
              break;
            case "Makeup":
              displayName = "Makeup Service";
              break;
            case "Nails":
            case "Nail":
              displayName = "Nail Service";
              break;
            default:
              displayName = service.mainService;
          }
          if (!acc[displayName]) acc[displayName] = [];
          acc[displayName].push(service);
          return acc;
        }, {});

        setCategorizedServices(groups);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/recommendations/${user._id}`);
        console.log("Service recommendations:", res.data); // log to debug
        setRecommendedServices(res.data?.recommendedServices || []);
      } catch (err) {
        console.error("Error fetching service recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [user]);


  if (loading) return <div className="text-center py-8">Loading services...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceHeader />
      <div className="max-w-6xl mx-auto py-16 px-4">
        {Object.entries(categorizedServices).map(([categoryName, services]) => (
          <div key={categoryName} className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
              {categoryName}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-gray-500 text-sm">
                      <span>Duration: {service.duration} hours</span>
                      <span>Price: Rs {service.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
