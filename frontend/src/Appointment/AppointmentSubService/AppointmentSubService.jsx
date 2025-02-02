import React from 'react';
import { ServiceList } from './ServiceList';

export const AppointmentSubService = () => {
  const handleBack = () => {
    console.log('Navigate back');
  };

  return (
    <main className="flex flex-col self-center mt-2.5 w-full max-w-[1602px] bg-white px-4">
      <h1 className="self-center text-5xl font-bold text-black max-md:max-w-full max-md:text-4xl">
        Book your appointment now
      </h1>
      
      <h2 className="self-start mt-20 text-4xl font-semibold text-black max-md:mt-10">
        Select Service
      </h2>
      
      <div className="shrink-0 mt-16 w-full h-1 border border-black border-solid max-md:mt-10" />
      
      <ServiceList />

      <button 
        onClick={handleBack}
        className="overflow-hidden self-center px-16 py-4 mt-28 max-w-full text-3xl text-white whitespace-nowrap bg-pink-500 rounded-[100px] w-[209px] max-md:px-5 max-md:mt-10 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        aria-label="Go back to previous page"
      >
        Back
      </button>
    </main>
  );
};