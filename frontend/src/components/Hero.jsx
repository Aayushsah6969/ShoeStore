import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
          Step Into
          <span className="block text-orange-500">Your Style</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          Discover the perfect blend of comfort, style, and performance in our curated collection of premium footwear.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Shop Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <Link
            to="/featured"
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View Featured
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">10,000+</div>
            <div className="text-base sm:text-lg">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-base sm:text-lg">Premium Styles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">24/7</div>
            <div className="text-base sm:text-lg">Customer Support</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;