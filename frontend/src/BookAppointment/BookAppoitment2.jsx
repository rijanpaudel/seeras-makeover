import * as React from "react";
import { ServiceCard } from "./ServiceCard";
import { QuickLinks } from "./QuickLinks";

const services = [
  {
    title: "Hair Keratin",
    duration: { time: "60 mins" },
    price: "Rs 7000-8000"
  },
  {
    title: "Hair Conditioning",
    duration: { time: "45 mins", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/70abdee05a0b42452f3466f8699748122c6870957cbfc63aa83930b1ec321926?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792" },
    price: "Rs 7000-8000"
  },
  {
    title: "Hair Conditioning",
    duration: { time: "45 mins", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/70abdee05a0b42452f3466f8699748122c6870957cbfc63aa83930b1ec321926?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792" },
    price: "Rs 7000-8000"
  }
];

export default function BookAppointment2() {
  return (
    <div className="flex overflow-hidden flex-col font-medium bg-white">
      <div className="flex flex-col self-center mt-2.5 ml-7 w-full text-black max-w-[1602px] max-md:max-w-full">
        <h1 className="self-center text-5xl font-bold max-md:max-w-full max-md:text-4xl">
          Book your appointment now
        </h1>
        <h2 className="self-start mt-20 ml-6 text-4xl font-semibold max-md:mt-10 max-md:ml-2.5">
          Select Service
        </h2>
        <div className="shrink-0 mt-16 w-full h-1 border border-black border-solid max-md:mt-10" />
        
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}

        <button 
          className="overflow-hidden self-center px-16 py-4 mt-28 max-w-full text-3xl text-white whitespace-nowrap bg-pink-500 rounded-[100px] w-[209px] max-md:px-5 max-md:mt-10"
          tabIndex="0"
        >
          Back
        </button>
      </div>

      <div className="flex flex-wrap gap-5 justify-between items-start ml-16 w-full text-center max-w-[1573px] mt-[475px] max-md:mt-10 max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/41e8ebd661321a4351ec945d707d4f3c514c00ad76ff61c48b7c4486bbc9be62?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
          alt="Decorative footer image"
          className="object-contain self-end mt-10 w-full aspect-[1.34] max-md:max-w-full"
        />
        <QuickLinks />
        <div className="flex flex-col items-center">
          <div className="self-stretch text-4xl text-pink-500">
            Connect With Us
          </div>
          <div className="mt-8 text-2xl text-black">+977 9805238286</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/46896395a2997ca29e909d384da273dab34913f431ecda5f85c62e7b90ac9426?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
            alt=""
            className="object-contain aspect-[0.37] w-[52px]"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb03af537c20e167cd7aa6cd349b8b78921f776009adccfbac7f070dd8423df7?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
            alt=""
            className="object-contain aspect-[0.43] w-[63px]"
          />
        </div>
      </div>
      <div className="overflow-hidden px-16 py-3 mt-2.5 w-full text-xl text-center text-black bg-pink-100 max-md:px-5 max-md:max-w-full">
        Copyright ©2024 Seeras Makeover Unisex Parlour And Saloon All rights
        reserved
      </div>
    </div>
  );
}