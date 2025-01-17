import React from 'react'
import HomeServicesImage from './HomeServicesImage';
import SquareButton from '../Buttons/SquareButton';
import makeup from '../assets/makeup.png'
import hair from '../assets/hair.png'
import nail from '../assets/nail.png'
import skin from '../assets/skin.png'

const HomeServices = () => {
  return (
    <div className="bg-white flex items-center justify-center py-10">
      <div className="text-center">
        <h1 className="text-5xl font-semibold mb-20">Services at Seeras Makeover</h1>
        <div className="flex justify-center space-x-32 mb-8 text-3xl">
          <div className="flex flex-col items-center">
            <HomeServicesImage
              src={makeup}
              alt="Woman applying makeup with a brush"
            />
            <p>Makeup</p>
          </div>
          <div className="flex flex-col items-center">
            <HomeServicesImage
              src={hair}
              alt="Tools for manicure and pedicure, including nail polish"
            />
            <p>Hair</p>
          </div>
          <div className="flex flex-col items-center">
            <HomeServicesImage
              src={nail}
              alt="A hand holding a manicure tool"
            />
            <p>Manicure/Pedicure</p>
          </div>
          <div className="flex flex-col items-center">
            <HomeServicesImage
              src={skin}
              alt="Face undergoing skincare treatment"
            />
            <p>Skin</p>
          </div>
        </div>
        <SquareButton text="Explore More" onClick={() => alert("Explore more clicked!")} />
      </div>
    </div>
  );
};

export default HomeServices;
