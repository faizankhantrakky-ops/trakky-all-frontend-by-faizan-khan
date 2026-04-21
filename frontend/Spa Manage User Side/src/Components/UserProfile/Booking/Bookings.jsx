import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bookings.css";
import "../UserProfile.css";
import salonLogo from "../salon-logo.png";
import { Modal, Box, Typography, Button } from "@mui/material";
import Reschedule from "./Reschedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrentBooking from "./CurrentBooking";
import HistoryBooking from "./HistoryBooking";
const Bookings = () => {
  const [isCurrentBookings, setCurrentBookings] = useState(true);

  const handleToggleBookings = (current) => {
    setCurrentBookings(current);
  };

  return (
    <div className="edit-Profile-container">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="toggle-buttons">
        <button
          className={isCurrentBookings && "active"}
          onClick={() => handleToggleBookings(true)}
        >
          CURRENT
        </button>
        <button
          className={!isCurrentBookings && "active"}
          onClick={() => handleToggleBookings(false)}
        >
          HISTORY
        </button>
      </div>
      <div className={isCurrentBookings ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "grid grid-cols-1 gap-6"}>
        {isCurrentBookings ? (
          <>
          <CurrentBooking/>
          <CurrentBooking/>
          <CurrentBooking/>
          </>
        ) : (
          <>
          <HistoryBooking/>
          <HistoryBooking/>
          <HistoryBooking/>
          </>
        )}
      </div>
    </div>
  );
};
export default Bookings;
