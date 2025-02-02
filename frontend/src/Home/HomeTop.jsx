import React from 'react';
import hometop from '../assets/home_top.jpg'
import SquareButton from '../Buttons/SquareButton';

const HomeTop = () => {
  return (
    <div className="relative w-full h-screen">
      <img
        src={hometop}
        alt="Bride Image"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center ml-10">
        <div className="text-white">
          <h1 className="text-6xl font-light mb-4">Unisex Parlour<br />and Saloon</h1>
          <SquareButton text="Book Appointment"/>  
        </div>
      </div>
    </div>
  );
};

export default HomeTop;
