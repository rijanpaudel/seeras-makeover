import React from 'react';
import { useState } from 'react';
import ServiceHeader from './ServiceHeader';
import ServiceItem from './ServiceItem';

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
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <ServiceHeader />
        
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="space-y-6">
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                isExpanded={expandedService === service.id}
                onClick={() => setExpandedService(
                  expandedService === service.id ? null : service.id
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;