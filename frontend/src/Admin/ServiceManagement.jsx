import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Plus, Upload } from "lucide-react";

const ServiceManagement = () => {
  const [mainService, setMainService] = useState("Makeup");
  const [subServices, setSubServices] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [newSubService, setNewSubService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: null,
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
      const formData = new FormData();
      formData.append("name", newSubService.name);
      formData.append("description", newSubService.description);
      formData.append("price", newSubService.price);
      formData.append("duration", newSubService.duration);
      formData.append("mainService", mainService);
      if (newSubService.image) {
        formData.append("image", newSubService.image); // Append image file
      }

      await axios.post("http://localhost:5000/api/sub-services/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Refresh the list after adding new sub-service
      const response = await axios.get(`http://localhost:5000/api/sub-services/${mainService}`);
      setSubServices(response.data);

      // Reset form
      setNewSubService({
        name: "",
        description: "",
        price: "",
        duration: "",
        image: null,
      });
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error adding sub-service:", error);
    }
  };

  const handleEditClick = (service) => {
    setIsEditing(true);
    setCurrentService(service);
    setNewSubService({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
  };

  const handleUpdateSubService = async () => {
    try {
      await axios.put(`http://localhost:5000/api/sub-services/edit/${currentService._id}`, {
        ...newSubService,
        price: Number(newSubService.price),
      });

      // Refresh the list after updating the sub-service
      const response = await axios.get(`http://localhost:5000/api/sub-services/${mainService}`);
      setSubServices(response.data);

      // Reset form
      setIsEditing(false);
      setCurrentService(null);
      setNewSubService({
        name: "",
        description: "",
        price: "",
        duration: "",
      });
    } catch (error) {
      console.error("Error updating sub-service:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sub-services/delete/${id}`);

      setSubServices(subServices.filter(service => service._id !== id));
    } catch (error) {
      console.error("Error deleting sub-service:", error);
    }
  };

  const mainServices = [
    { value: "Makeup", label: "Makeup Services" },
    { value: "Hair", label: "Hair Services" },
    { value: "Nails", label: "Nail Services" },
    { value: "Skin", label: "Skin Services" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
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

              <div className="flex items-center">
                <label className="w-full flex items-center justify-center p-3 border border-gray-300 border-dashed rounded-lg hover:border-pink-500 cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setNewSubService({ ...newSubService, image: e.target.files[0] })}
                    className="hidden"
                    accept="image/*"
                  />
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Choose image</span>
                </label>
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
              {service.image && (
                <img src={`http://localhost:5000${service.image}`} alt={service.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
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
                  <button
                    onClick={() => handleEditClick(service)}
                    className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service._id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Service Form */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Edit Service</h2>
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
                  onClick={handleUpdateSubService}
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                >
                  Update Service
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentService(null);
                    setNewSubService({
                      name: "",
                      description: "",
                      price: "",
                      duration: "",
                    });
                  }}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;