import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-28">
        {/* Hero Section */}
        <section className="mb-12 text-center pt-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            About Seeras Makeover
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transforming beauty experiences since 2015 with premium services and products
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Story Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h3>
            <p className="text-gray-600">
              Founded in 2015, Seeras Makeover has grown from a small beauty parlor to a leading
              beauty destination offering complete makeover solutions. We combine international
              techniques with personalized care to deliver exceptional results.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To empower individuals through premium beauty services and education, while
              maintaining the highest standards of hygiene and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Our Experts
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src="/path-to-team-image.jpg" 
                  alt="Team Member"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-800">John Doe</h4>
                  <p className="text-gray-600">Senior Beauty Specialist</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Our Values
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Quality</h4>
              <p className="text-gray-600">Using only premium international products</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Hygiene</h4>
              <p className="text-gray-600">Sterilized tools and single-use products</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Expertise</h4>
              <p className="text-gray-600">Certified professionals with 5+ years experience</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;