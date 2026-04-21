import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bookings.css";
import "../UserProfile.css";
import salonLogo from "../salon-logo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Box, Typography, Button } from "@mui/material";
import Reschedule from "./Reschedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrentBooking from "./CurrentBooking";
import HistoryBooking from "./HistoryBooking";
import HistoryIcon from "@mui/icons-material/History";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const Bookings = () => {
  const [isCurrentBookings, setCurrentBookings] = useState(true);

  const handleToggleBookings = (current) => {
    setCurrentBookings(current);
  };

  return (
    <div className="bg-gray-50 py-8 md:px-4 px-2">
      <div className="">
        
        {/* Header */}
        <div className=" mb-6">
        
          <h1 className="text-xl font-bold text-gray-900 mb-3 ">My Bookings</h1>
          <div className="w-20 h-1 bg-[#502DA6]  mb-4"></div>
          <p className="text-gray-600 max-w-md ">
            Manage your salon appointments and booking history
          </p>
        </div>

        {/* Classic Tabs */}
        <div className="flex  border-b border-gray-300 mb-4 bg-white rounded-t-lg">
            <button
            onClick={() => handleToggleBookings(true)}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-medium transition-all duration-300 relative ${
              isCurrentBookings
                ? "text-[#502DA6]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <EventAvailableIcon className="w-5 h-5" />
            Current Bookings
            {isCurrentBookings && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#502DA6]"></span>
            )}
          </button>


          <button
            onClick={() => handleToggleBookings(false)}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-medium transition-all duration-300 relative ${
              !isCurrentBookings
                ? "text-[#502DA6]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <HistoryIcon className="w-5 h-5" />
            Booking History
            {!isCurrentBookings && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#502DA6]"></span>
            )}
          </button>
        
        </div>

        {/* Content Area */}
<div className={isCurrentBookings 
  ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
  : "grid grid-cols-1 gap-6"
}>
  {isCurrentBookings ? (
    <CurrentBooking />
  ) : (
    <HistoryBooking />
  )}
</div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <EventAvailableIcon className="text-[#502DA6] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Booking Information</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Manage all your salon appointments in one place. View upcoming bookings, 
                check your booking history, and keep track of your salon visits. For any 
                changes to your bookings, please contact the salon directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;