import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Star, CheckCircle } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sub-services/service/${id}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service:', error);
        setError("Failed to load service details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-red-500 bg-red-50 px-6 py-3 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          Services / {service.mainService} / {service.name}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className="relative">
            {service.image ? (
              <img
                src={`http://localhost:5000${service.image}`}
                alt={service.name}
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-[500px] bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-20 h-20 text-pink-400" />
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
              <div className="flex items-center gap-2 text-pink-600 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">Best Rated Service</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-2" />
                <span>{service.duration} hours  </span>
              </div>
              <div className="flex items-center text-gray-900 font-bold text-2xl">
                <span>Rs {service.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Includes:</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Professional consultation', 'Quality products used', 'Hygiene guaranteed', 'Expert beauticians'].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                // Navigate to DateTimeSelector with the selected service details
                navigate(`/datetimeselector/${service._id}`, { state: { service } });
              }}
              className="w-full bg-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-pink-600 transition-colors mt-8">
              Book Appointment
            </button>

            <div className="bg-pink-50 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">Special Note</h3>
              <p className="text-gray-600">
                Please arrive 10 minutes before your scheduled appointment. For bridal services,
                we recommend booking at least 2 weeks in advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;