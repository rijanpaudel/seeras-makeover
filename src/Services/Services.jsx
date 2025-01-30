import React, { useState } from 'react';
import { ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon } from "lucide-react";
import Navbar from '../Navbar/navbar';

const Services = () => {
  const [expandedService, setExpandedService] = useState(null);
  
  const services = [
    {
      id: 1,
      name: "Hair Care Services",
      image: "/api/placeholder/400/200",
      description: "Complete hair care solutions for all types of hair",
      subServices: [
        {
          id: 'hair-1',
          name: "Hair Cutting",
          items: ["Layer Cut", "U-Cut", "Feather Cut", "Bob Cut", "Pixie Cut"]
        },
        {
          id: 'hair-2',
          name: "Hair Styling",
          items: ["Hair Straightening", "Curling", "Hair Spa", "Oil Treatment"]
        },
        {
          id: 'hair-3',
          name: "Hair Color",
          items: ["Global Color", "Highlights", "Lowlights", "Balayage"]
        }
      ]
    },
    {
      id: 2,
      name: "Skin Care Services",
      image: "/api/placeholder/400/200",
      description: "Professional skin treatments for radiant skin",
      subServices: [
        {
          id: 'skin-1',
          name: "Facials",
          items: ["Classic Facial", "Gold Facial", "Diamond Facial", "Anti-aging Facial"]
        },
        {
          id: 'skin-2',
          name: "Skin Treatments",
          items: ["Skin Brightening", "Acne Treatment", "Pigmentation Treatment"]
        }
      ]
    },
    {
      id: 3,
      name: "Bridal Services",
      image: "/api/placeholder/400/200",
      description: "Complete bridal makeup and styling packages",
      subServices: [
        {
          id: 'bridal-1',
          name: "Bridal Makeup",
          items: ["HD Makeup", "Airbrush Makeup", "Traditional Makeup"]
        },
        {
          id: 'bridal-2',
          name: "Bridal Packages",
          items: ["Pre-wedding", "Wedding Day", "Reception"]
        }
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-lg">Discover our range of professional beauty and wellness services</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="grid gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Service Header */}
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                >
                  <div className="flex items-center p-6">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-24 h-24 object-cover rounded-lg mr-6"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-800">{service.name}</h2>
                      <p className="text-gray-600 mt-2">{service.description}</p>
                    </div>
                    {expandedService === service.id ? 
                      <ChevronDownIcon className="w-6 h-6 text-pink-500" /> : 
                      <ChevronRightIcon className="w-6 h-6 text-pink-500" />
                    }
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedService === service.id && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {service.subServices.map((subService) => (
                        <div 
                          key={subService.id}
                          className="bg-pink-50 rounded-lg p-4"
                        >
                          <h3 className="text-lg font-semibold text-pink-600 mb-3">
                            {subService.name}
                          </h3>
                          <ul className="space-y-2">
                            {subService.items.map((item, index) => (
                              <li 
                                key={index}
                                className="flex items-center text-gray-700"
                              >
                                <ChevronRightIcon className="w-4 h-4 text-pink-400 mr-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;