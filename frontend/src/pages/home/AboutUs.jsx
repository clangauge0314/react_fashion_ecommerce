import React from "react";
import image1 from "../../assets/image1.webp";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <div
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-white text-5xl font-bold text-center">
          About Us
        </h1>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-semibold mb-6">Who We Are</h2>
        <p className="text-lg leading-relaxed">
          We are a passionate team dedicated to delivering exceptional services
          and products to our customers. Our mission is to create solutions that
          inspire and empower individuals and businesses alike.
        </p>
      </div>

      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-8">
          <img
            src="https://via.placeholder.com/600x400"
            alt="About Us"
            className="rounded-lg shadow-md"
          />
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
            <p className="text-lg leading-relaxed">
              We believe in pushing boundaries and innovating to bring the best
              to our customers. Our vision is to lead the way in our industry
              and inspire others through our work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
