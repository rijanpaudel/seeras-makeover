import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Plus } from "lucide-react";

const ServiceManagement = () => {
  const [mainService, setMainService] = useState("Makeup");
  const [subServices, setSubServices] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubService, setNewSubService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sub-services/${mainService}`);
        setSubServices(response.data); // Set the fetched sub-services for the selected service
      } catch (error) {
        console.error("Error fetching sub-services:", error);
      }
    };

    fetchSubServices();
  }, [mainService]); // Run this whenever mainService changes

  const handleAddSubService = async () => {
    try {
      await axios.post("http://localhost:5000/api/sub-services/add", {
        ...newSubService,
        mainService,
        price: Number(newSubService.price),
      });
      
      // Refresh the list after adding new sub-service
      const response = await axios.get(`http://localhost:5000/api/sub-services/${mainService}`);
      setSubServices(response.data);
      
      // Reset form
      setNewSubService({
        name: "",
        description: "",
        price: "",
        duration: "",
      });
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error adding sub-service:", error);
    }
  };

  const mainServices = [
    { value: "Makeup", label: "Makeup Services" },
    { value: "Hair", label: "Hair Services" },
    { value: "Nails", label: "Nail Services" },
  ];

  return (
    <div className="container mx-auto px-4 py-56">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Service Management</h1>

        {/* Service Type Selector */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Service Category
          </label>
          <select
            value={mainService}
            onChange={(e) => setMainService(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white"
          >
            {mainServices.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Service Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <Plus size={20} />
            Add New Service
          </button>
        </div>

        {/* Add New Service Form */}
        {isAddingNew && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Service</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bridal Makeup"
                  value={newSubService.name}
                  onChange={(e) => setNewSubService({ ...newSubService, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Service description..."
                  value={newSubService.description}
                  onChange={(e) => setNewSubService({ ...newSubService, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 h-32"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Price (Rs)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newSubService.price}
                    onChange={(e) => setNewSubService({ ...newSubService, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2 hours"
                    value={newSubService.duration}
                    onChange={(e) => setNewSubService({ ...newSubService, duration: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddSubService}
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                >
                  Save Service
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="grid gap-4">
          {subServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex gap-4">
                    <div className="text-pink-500 font-medium">
                      Rs {service.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      Duration: {service.duration}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
                    <Edit size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
