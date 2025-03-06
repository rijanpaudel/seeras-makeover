import React from 'react';
import shirasharma from '../assets/shira_sharma.jpg'
import seerasmakeoverinterior from '../assets/seeras_makeover_interior.jpg'

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Image - Parlour Building */}
      <div className="w-full h-full relative overflow-hidden">
        <img 
          src={seerasmakeoverinterior} 
          alt="Seeras Makeover Parlour Building"
          className="w-full h- object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">Seeras Makeover</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16 -mt-20">
        {/* About Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-4">Est. 2015</span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              About Our Beauty Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transforming beauty experiences with premium services and products for a decade
            </p>
          </div>

          {/* Story & Mission Grid with Design Elements */}
          <div className="grid md:grid-cols-2 gap-10 mb-12 relative">
            {/* Decorative Element */}
            <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-40 bg-gradient-to-b from-pink-300 to-purple-400 rounded-r-lg"></div>
            
            {/* Story Section */}
            <div className="bg-gray-50 p-8 rounded-lg border-b-4 border-pink-400 hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-pink-400 text-white flex items-center justify-center mr-3">1</span>
                Our Story
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2015, Seeras Makeover has evolved from a modest beauty parlor to a leading beauty destination. 
                Our journey has been defined by innovation and excellence, combining international techniques with personalized 
                care to deliver exceptional results that empower our clients to feel their absolute best.
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-gray-50 p-8 rounded-lg border-b-4 border-purple-400 hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-purple-400 text-white flex items-center justify-center mr-3">2</span>
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To empower individuals through premium beauty services and education, while
                maintaining the highest standards of hygiene and customer satisfaction. We believe beauty is a form 
                of self-expression, and our mission is to help you discover and enhance your unique beauty.
              </p>
            </div>
          </div>

          {/* Two Experts Section */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Meet Our Experts
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Expert 1 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={shirasharma} 
                    alt="Seera Williams - Founder"
                    className="w-full h-[500px] object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl text-gray-800 mb-1">Shira Sharma</h4>
                  <p className="text-pink-600 font-medium mb-3">Founder & Master Stylist</p>
                  <p className="text-gray-600 mb-4">
                    With over 15 years of experience, Shira brings world-class expertise to every service. 
                    Her innovative techniques and commitment to personalized care have established 
                    Seeras Makeover as a premier beauty destination.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Certified Beautician</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Beauty Educator</span>
                  </div>
                </div>
              </div>

              {/* Expert 2 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="/api/placeholder/600/600" 
                    alt="Maya Johnson - Beauty Specialist"
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl text-gray-800 mb-1">Zishan Khan</h4>
                  <p className="text-purple-600 font-medium mb-3">Senior Beauty Specialist</p>
                  <p className="text-gray-600 mb-4">
                    Maya specializes in advanced skincare treatments and makeup artistry. With international 
                    training and 10 years of experience, she creates custom beauty solutions 
                    tailored to each client's unique features and preferences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Makeup Artist</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Skincare Expert</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section with Modern Icons */}
          <section>
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Our Core Values
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Premium Quality</h4>
                <p className="text-gray-600">Using only the finest international products and techniques for exceptional results</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Absolute Hygiene</h4>
                <p className="text-gray-600">Sterilized tools, single-use products, and a spotlessly clean environment</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">Professional Expertise</h4>
                <p className="text-gray-600">Our team of certified professionals with extensive industry experience</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;