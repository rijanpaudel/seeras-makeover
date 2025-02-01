import React from 'react';
import { ServiceCard } from './ServiceCard';

const services = [
  {
    title: 'Hair Keratin',
    duration: '60 mins',
    price: 'Rs 7000-8000',
  },
  {
    title: 'Hair Conditioning',
    duration: '45 mins',
    price: 'Rs 7000-8000',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3d7f9154e289907282be431d49d1465472496b35e79efabd52e62a542631f82b'
  },
  {
    title: 'Hair Treatment',
    duration: '45 mins',
    price: 'Rs 7000-8000',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3d7f9154e289907282be431d49d1465472496b35e79efabd52e62a542631f82b'
  }
];

export const ServiceList = () => {
  const handleServiceSelect = (serviceName) => {
    console.log(`Selected service: ${serviceName}`);
  };

  return (
    <div className="w-full">
      {services.map((service, index) => (
        <ServiceCard 
          key={index}
          {...service}
          onSelect={handleServiceSelect}
        />
      ))}
    </div>
  );
};