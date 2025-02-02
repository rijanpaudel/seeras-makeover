import React from 'react';

export const ServiceCard = ({ title, duration, price, icon, onSelect }) => {
  return (
    <>
      <div className="flex flex-wrap gap-5 justify-between self-center mt-9 ml-5 w-full max-w-[1491px] max-md:max-w-full">
        <div className="flex flex-col">
          <div className="text-3xl">{title}</div>
          <div className="flex self-start mt-4 text-3xl">
            {icon && (
              <img
                loading="lazy"
                src={icon}
                alt=""
                className="object-contain shrink-0 self-start mt-1 aspect-[1.03] w-[30px]"
              />
            )}
            <div className="basis-auto">{duration}</div>
          </div>
        </div>
        <div className="my-auto text-3xl">{price}</div>
        <button 
          onClick={() => onSelect(title)}
          className="overflow-hidden self-start px-16 py-4 mt-1 text-3xl text-pink-500 whitespace-nowrap bg-white border border-pink-500 border-solid rounded-[100px] max-md:px-5 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label={`Select ${title} service`}
        >
          Select
        </button>
      </div>
      <div className="shrink-0 mt-8 w-full h-1 border border-black border-solid" />
    </>
  );
};