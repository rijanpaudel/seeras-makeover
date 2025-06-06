import React from "react";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-transparent flex justify-center w-full">
      <div className="w-full md:w-[1920px] h-auto relative py-8 md:py-16">
        <img
          className="w-[200px] md:w-[344px] h-auto mx-auto md:ml-[65px]"
          alt="Seera's makeover logo"
          src={logo}
        />

        <div className="mt-8 md:absolute md:top-8 md:left-[771px] font-medium text-pink-500 text-[32px] md:text-[40px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          Quick Links
        </div>

        <div className="mt-8 md:absolute md:top-8 md:left-[1315px] font-medium text-pink-500 text-[32px] md:text-[40px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          Connect With Us
        </div>

        <div className="mt-8 md:absolute md:top-[117px] md:left-[820px] font-medium text-black text-[20px] md:text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          <Link to="/services" className="hover:text-pink-500 transition-colors duration-300">
            Services
          </Link>
        </div>

        <div className="mt-8 md:absolute md:w-[226px] md:h-[241px] md:top-[111px] md:left-[1347px] text-center md:text-left">
          <div className="md:absolute md:top-0 md:left-0 font-medium text-black text-[20px] md:text-[25px] whitespace-nowrap">
            +977 9805238286
          </div>

          

          <div className="flex justify-center md:block mt-4 md:mt-0">
            <a href="https://www.facebook.com/makeoverseer/" target="_blank">
              <img
                className="w-[36px] h-auto md:w-[52px] md:h-auto mx-2 md:mx-0 md:absolute md:top-[60px] md:left-0"
                alt="Facebook"
                src={facebook}
              />
            </a>
            <a href="https://www.instagram.com/seeras_makeover/" target="_blank">
              <img
                className="w-[42px] h-auto md:w-[63px] md:h-auto mx-2 md:mx-0 md:absolute md:top-[60px] md:left-[70px]"
                alt="Instagram"
                src={instagram}
              />
            </a>
          </div>
        </div>

        <div className="mt-8 md:absolute md:top-[165px] md:left-[757px] font-medium text-black text-[20px] md:text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          <Link to="/appointment" className="hover:text-pink-500 transition-colors duration-300">
            Book Appointment
          </Link>
        </div>

        <div className="mt-8 md:absolute md:top-[213px] md:left-[827px] font-medium text-black text-[20px] md:text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          <Link to ="/aboutus" className="hover:text-pink-500 transition-colors duration-300">
            About us
          </Link>
        </div>

        <div className="mt-8 md:absolute md:top-[261px] md:left-[828px] font-medium text-black text-[20px] md:text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          <Link to="/products" className="hover:text-pink-500 transition-colors duration-300">
            Products
          </Link>
        </div>

        <div className="mt-8 md:absolute md:top-[304px] md:left-[820px] font-medium text-black text-[20px] md:text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          <Link to="/enroll" className="hover:text-pink-500 transition-colors duration-300">
            Enroll now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;