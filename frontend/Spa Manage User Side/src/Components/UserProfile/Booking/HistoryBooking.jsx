import React from "react";
import salonLogo from "../salon-logo.png";

function HistoryBooking() {
  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-300 p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4 sm:gap-6">
        {/* Salon Image */}
        <img src={salonLogo} alt="Salon Logo" className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg border border-gray-200" />
        
        {/* Booking Details */}
        <div className="flex flex-col gap-3">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-800">Black Panther Salon</h1>
          <p className="text-sm sm:text-base text-gray-600">Bridal Package</p>
          
          {/* Date and Location */}
          <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700">
            <span className="text-xs sm:text-sm">26 Jun, 2024 | 5:00 PM</span>
            <span className="text-xs sm:text-sm whitespace-nowrap">Odhav, Ahmedabad, Gujarat</span>
          </div>
          
          {/* Amount Paid */}
          <div className="flex justify-between text-sm sm:text-base font-medium text-gray-800">
            <span>Amount Paid</span>
            <span>₹5000</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 w-full mt-2 sm:mt-4"></div>

      {/* Footer Message */}
      <p className="text-center text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4">
        Hope you liked the service
      </p>
    </div>
  );
}

export default HistoryBooking;
