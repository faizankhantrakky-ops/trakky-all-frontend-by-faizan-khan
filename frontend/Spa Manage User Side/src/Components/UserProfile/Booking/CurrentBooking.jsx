import React from 'react';
import salonLogo from "../salon-logo.png";

const CurrentBooking = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="flex flex-col space-y-4">
        <img src={salonLogo} alt="Salon Logo" className="w-24 h-24 mx-auto rounded-full border-2 border-purple-500" />
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Black Panther Salon</h1>
        <div className="text-center text-gray-600">
          <p>Vastrapur, Ahmedabad</p>
          <p>September 24, 7:32 PM</p>
        </div>
        <p className="text-2xl font-bold text-purple-600 text-center">₹520</p>
        <div className="border-dashed border-t-2 border-gray-300 pt-4"></div>
        
        {/* Service Details */}
        <div className="flex items-center space-x-4 py-4">
          <img src={salonLogo} alt="Service" className="w-16 h-16 rounded-lg border border-gray-300" />
          <div className="flex-1">
            <div className="flex justify-between text-gray-800 text-sm font-medium">
              <span>Hair</span>
              <span>₹520</span>
            </div>
            <p className="text-gray-600 text-sm">Regular Hair Wash</p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="space-y-2 text-gray-800 text-sm">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-semibold">T4W21L</span>
          </div>
          <div className="flex justify-between">
            <span>Coins Used</span>
            <span className="font-semibold">₹0</span>
          </div>
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span className="font-semibold">₹520</span>
          </div>
          <div className="flex justify-between">
            <span>Discount (2%)</span>
            <span className="font-semibold">₹10.4</span>
          </div>
        </div>
        
        <div className="border-dashed border-t-2 border-gray-300 pt-4"></div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-6 space-x-2">
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform transform active:scale-95">
            Reschedule
          </button>
          <button className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-transform transform active:scale-95">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentBooking;
