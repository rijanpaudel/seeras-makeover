import React from 'react'
import { useNavigate } from 'react-router-dom';
import SquareButton from '../Buttons/SquareButton';
import makeup from '../assets/makeup.png'
import hair from '../assets/hair.png'
import nail from '../assets/nail.png'
import skin from '../assets/skin.png'

const services = [
  {
    name: 'Makeup',
    image: makeup,
    link: '/services/makeup',
    alt: 'Woman applying makeup with a brush'
  },
  {
    name: 'Hair',
    image: hair,
    link: '/services/hair',
    alt: 'Tools for manicure and pedicure, including nail polish'
  },
  {
    name: 'Manicure/Pedicure',
    image: nail,
    link: '/services/nail',
    alt: 'A hand holding a manicure tool'
  },
  {
    name: 'Skin',
    image: skin,
    link: '/services/skin',
    alt: 'Face undergoing skincare treatment'
  }
];

const HomeServices = () => {
  const navigate = useNavigate();

  const goToRoute = () => {
    navigate("/services");
  }
  
  return (
    <div className="bg-white px-4 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold mb-8 md:mb-12">
          Services at Seeras Makeover
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center group transition-transform duration-300 hover:scale-105"
            >
              <div className="w-24 sm:w-28 md:w-32 lg:w-36 mb-3">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                />
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl group-hover:text-pink-500 transition-colors duration-300">
                {service.name}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button 
            className="px-5 py-2 bg-pink-500 text-white text-sm sm:text-base font-medium rounded shadow hover:bg-pink-600 transition-colors duration-300"
            onClick={goToRoute}
          >
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeServices;