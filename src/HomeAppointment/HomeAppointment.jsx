import React from "react";
import homeappointment from '../assets/homeappointment.jpg'

const HomeAppointment = () => {
  return (
    <div className="bg-pink-100 flex items-center justify-center py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Book <span className="text-pink-500">appointment</span> now
        </h1>
        <p className="text-lg mb-8">
          Book your appointment today and indulge in our range of beauty services, including makeup, haircare, nails, and skin treatments. 
          Our online booking system makes it easy to find your perfect time slot and experience the Seera's Makeover difference.
        </p>
        <div className="flex space-x-96">
        <div className="flex justify-center mb-8">
          <img
            src={homeappointment}
            alt="A stylist applying makeup to a woman in a salon"
            className="rounded-lg"
          />
        </div>
        <div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <i className="fas fa-ring text-3xl mb-2"></i>
            <p>Bridal Packages</p>
          </div>
          <div className="text-center">
            <i className="fas fa-spa text-3xl mb-2"></i>
            <p>Facial Care</p>
          </div>
          <div className="text-center">
            <i className="fas fa-magic text-3xl mb-2"></i>
            <p>Makeup Services</p>
          </div>
          <div className="text-center">
            <i className="fas fa-cut text-3xl mb-2"></i>
            <p>Hair Care</p>
          </div>
          <div className="text-center">
            <i className="fas fa-hand-sparkles text-3xl mb-2"></i>
            <p>Nair Care</p>
          </div>
        </div>
        <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded">
          Book Appointment
        </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAppointment;
