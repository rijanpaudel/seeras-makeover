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
    <div className="bg-white px-4 py-10">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-10 md:mb-20">
          Services at Seeras Makeover
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-16 mb-10 md:mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center group transition-transform duration-300"
            >
              <div className="w-32 md:w-44 mb-4">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                />
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl group-hover:text-pink-500 transition-colors duration-300">
                {service.name}
              </p>
            </div>
          ))}
        </div>



        <div className="flex justify-center">
          <button className="px-6 py-2 bg-pink-500 text-white font-medium rounded shadow"
            onClick={goToRoute}>
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeServices;