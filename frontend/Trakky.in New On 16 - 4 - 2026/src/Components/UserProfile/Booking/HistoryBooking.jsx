import React, { useEffect, useState, useContext } from "react";
import salonLogo from "../salon-logo.png";
import AuthContext from "../../../context/Auth";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarToday,
  Schedule,
  LocationOn,
  Payment,
  Star,
  Feedback,
  Report,
  CheckCircle,
  ArrowForwardIos,
  Warning,
  Description
} from "@mui/icons-material";

const formatTimeToAMPM = (timeString) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${period}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short"
  });
};

function HistoryBooking() {
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authTokens, user, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoryBookings = async () => {
      try {
        if (!authTokens || !user || !userData) {
          setError("Authentication required or user data not loaded");
          setLoading(false);
          return;
        }

        const userId = user.user_id;
        const userPhone = userData.phone_number;

        if (!userId && !userPhone) {
          setError("Unable to identify user");
          setLoading(false);
          return;
        }

        let url = `https://backendapi.trakky.in/salons/booking/?section=history&is_payment_done=true`;

        if (userId) {
          url += `&salonuser=${userId}`;
        }

        if (userPhone) {
          url += `&user_phone=${userPhone}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history bookings");
        }

        const data = await response.json();
        setHistoryBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authTokens && user && userData) {
      fetchHistoryBookings();
    } else {
      setLoading(false);
      setError("User data not loaded yet");
    }
  }, [authTokens, user, userData]);

  const handleReportSalon = (booking) => {
    const salonData = {
      salonId: booking.salon || booking.salon_id,
      salonName: booking.salon_name,
      salonCity: booking.salon_city,
      salonArea: booking.salon_area,
      bookingId: booking.id,
    };

    navigate("/userProfile/report-salon", {
      state: { salonData },
    });
  };

  const handleFeedback = (booking) => {
    const salonData = {
      salonId: booking.salon || booking.salon_id,
      salonName: booking.salon_name,
      salonCity: booking.salon_city,
      salonArea: booking.salon_area,
      bookingId: booking.id,
    };

    navigate("/userProfile/feedback", {
      state: { salonData },
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking History</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Your completed appointments</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-lg">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking History</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Your completed appointments</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center">
          <Warning className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2">Unable to Load Bookings</h3>
          <p className="text-red-600 text-sm sm:text-base mb-4 sm:mb-6">{error}</p>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (historyBookings.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking History</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Your completed appointments</p>
        </div>
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <Description className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">No Past Bookings</h3>
          <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
            You haven't completed any appointments yet. Start your journey with our premium services.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Book Your First Appointment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-5">
      {/* Bookings Grid */}
      <div className="space-y-4 sm:space-y-6">
        {historyBookings.map((booking) => {
          let services = [];
          let totalAmount = 0;
          let serviceNames = "No specific service";

          if (
            typeof booking.included_services === "object" &&
            booking.included_services !== null
          ) {
            services = Object.entries(booking.included_services);
            totalAmount = services.reduce(
              (sum, [_, service]) => sum + (service.price || 0),
              0
            );
            serviceNames = services.map(([name]) => name).join(", ");
          } else if (typeof booking.included_services === "number") {
            serviceNames = "Service details not available";
          }

          return (
            <div 
              key={booking.id} 
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Header Section */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className="relative flex-shrink-0">
                      <img
                        src={booking.salon_main_image || salonLogo}
                        alt={booking.salon_name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover border-2 border-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        {booking.salon_name}
                      </h3>
                      <p className="text-gray-600 mt-1 text-xs sm:text-sm line-clamp-2">
                        {serviceNames}
                      </p>
                    </div>
                  </div>
                  <ArrowForwardIos className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-1 sm:mt-2" />
                </div>
              </div>

              {/* Details Section */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Date & Time */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                      <CalendarToday className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Date</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">
                        {formatDate(booking.booking_date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                      <Schedule className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Time</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">
                        {formatTimeToAMPM(booking.booking_time)}
                      </span>
                    </div>
                  </div>

                  {/* Location & Amount */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                      <LocationOn className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Location</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[120px]">
                        {booking.salon_area}, {booking.salon_city}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                      <Payment className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Amount</span>
                      <span className="text-green-600 font-bold text-sm sm:text-base">
                        ₹{booking.total_amount_paid || 0.0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <p className="text-gray-600 text-xs sm:text-sm">
            Showing {historyBookings.length} completed booking{historyBookings.length !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-0">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}

export default HistoryBooking;