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
      description: "Expert hair care solutions tailored to enhance your unique style and hair type",
      subServices: [
        {
          id: 'hair-1',
          name: "Signature Cuts",
          items: ["Precision Layer Cut", "Modern U-Cut", "Feather Styling", "Classic Bob", "Pixie Revolution"]
        },
        {
          id: 'hair-2',
          name: "Luxury Styling",
          items: ["Silk Press Straightening", "Beach Wave Creation", "Rejuvenating Hair Spa", "Deep Oil Therapy"]
        },
        {
          id: 'hair-3',
          name: "Color Artistry",
          items: ["Premium Global Color", "Designer Highlights", "Natural Lowlights", "Custom Balayage"]
        }
      ]
    },
    {
      id: 2,
      name: "Skin Care Services",
      description: "Advanced skincare treatments using premium products for lasting radiance",
      subServices: [
        {
          id: 'skin-1',
          name: "Luxury Facials",
          items: ["24K Gold Facial", "Diamond Radiance", "Age-Defying Treatment", "Crystal Clear Facial"]
        },
        {
          id: 'skin-2',
          name: "Skin Solutions",
          items: ["Luminous Brightening", "Advanced Acne Care", "Pigment Perfect Treatment"]
        }
      ]
    },
    {
      id: 3,
      name: "Bridal Services",
      description: "Comprehensive bridal beauty services to make your special day unforgettable",
      subServices: [
        {
          id: 'bridal-1',
          name: "Bridal Artistry",
          items: ["Premium HD Makeup", "Airbrush Excellence", "Traditional Elegance"]
        },
        {
          id: 'bridal-2',
          name: "Complete Packages",
          items: ["Enchanting Pre-wedding", "Perfect Wedding Day", "Glamorous Reception"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceHeader />
      
      <div className="max-w-6xl mx-auto py-16 px-4">
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
  );
};

export default Services;