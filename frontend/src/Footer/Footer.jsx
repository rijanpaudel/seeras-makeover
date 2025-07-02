import React from "react";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { to: "/services", text: "Services" },
    { to: "/appointment", text: "Book Appointment" },
    { to: "/aboutus", text: "About us" },
    { to: "/products", text: "Products" },
    { to: "/enroll", text: "Enroll now" }
  ];

  return (
    <footer className="bg-transparent w-full py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex justify-center md:justify-start">
            <img
              className="w-36 sm:w-40 md:w-48 h-auto"
              alt="Seera's makeover logo"
              src={logo}
            />
          </div>

          {/* Quick Links Section */}
          <div className="text-center">
            <h3 className="font-medium text-pink-500 text-2xl sm:text-2xl md:text-3xl mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base sm:text-lg font-medium hover:text-pink-500 transition-colors duration-300"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect Section */}
          <div className="text-center md:text-left">
            <h3 className="font-medium text-pink-500 text-2xl sm:text-2xl md:text-3xl mb-4">
              Connect With Us
            </h3>
            <div className="space-y-3">
              <p className="font-medium text-base sm:text-lg">
                +977 9805238286
              </p>
              
              {/* Social Icons */}
              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                <a 
                  href="https://www.facebook.com/makeoverseer/" 
                  target="_blank"
                  className="transform hover:scale-110 transition-transform duration-300"
                >
                  <img
                    className="w-8 sm:w-10 md:w-12 h-auto"
                    alt="Facebook"
                    src={facebook}
                  />
                </a>
                <a 
                  href="https://www.instagram.com/seeras_makeover/" 
                  target="_blank"
                  className="transform hover:scale-110 transition-transform duration-300"
                >
                  <img
                    className="w-9 sm:w-11 md:w-14 h-auto"
                    alt="Instagram"
                    src={instagram}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;