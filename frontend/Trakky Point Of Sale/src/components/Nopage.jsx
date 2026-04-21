import React from "react";
import { Link } from "react-router-dom";

const Nopage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 md:pl-20">
      
      <div className="md:w-[1600px] w-full text-center">
        
        {/* 404 Text */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-[#4A2DBE] mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-[#4A2DBE] mx-auto mb-8"></div>

        {/* Suggestions */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">You might want to:</p>

          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <Link
                to="/"
                className="text-[#4A2DBE] hover:text-purple-700 font-medium transition-colors"
              >
                • Return to Homepage
              </Link>
            </li>

          
          </ul>
        </div>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-6 bg-[#4A2DBE] text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium shadow-md hover:shadow-lg"
        >
          Go Back Home
        </Link>

      </div>
    </div>
  );
};

export default Nopage;