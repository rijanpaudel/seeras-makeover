import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, AlertCircle } from "lucide-react";

const ServiceManagement = () => {
  const [services] = useState([
    { _id: "1", name: "Makeup" },
    { _id: "2", name: "Hair" },
    { _id: "3", name: "Nails" }
  ]);
  const [selectedService, setSelectedService] = useState("");
  const [subService, setSubService] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleChange = (e) => {
    setSubService({ ...subService, [e.target.name]: e.target.value });
  };

  const handleAddSubService = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/services/add-subservice", {
        serviceName: selectedService,
        subServiceName: subService.name,
        subServiceDescription: subService.description,
      });
      setMessage("Sub-service added successfully!");
      setMessageType("success");
      setSubService({ name: "", description: "" });
    } catch (error) {
      setMessage("Failed to add sub-service.");
      setMessageType("error");
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Sub-Service</h1>
          <p className="text-gray-600">Create new sub-services for your beauty categories</p>
        </div>

        <form onSubmit={handleAddSubService} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service Category
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            >
              <option value="">Select a Service</option>
              {services.map((service) => (
                <option key={service._id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Service Name
            </label>
            <input
              type="text"
              name="name"
              value={subService.name}
              onChange={handleChange}
              required
              placeholder="e.g., Bridal Makeup, Hair Coloring, Gel Nails"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Sub-Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Service Description
            </label>
            <textarea
              name="description"
              value={subService.description}
              onChange={handleChange}
              required
              placeholder="Enter a detailed description of the sub-service..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Add Sub-Service
          </button>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-center ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;