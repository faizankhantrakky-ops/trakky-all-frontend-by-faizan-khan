import React, { useEffect, useState, useContext } from "react";
import salonLogo from "../salon-logo.png";
import AuthContext from "../../../context/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalPortal from "./ModalPortal/ModalPortal";
import { TicketsIcon } from "lucide-react";
const formatTimeToAMPM = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

// Icons (same as before)
const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const TimeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LocationIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PaymentIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const TicketIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 5vet 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CurrentBooking = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authTokens, user, userData } = useContext(AuthContext);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Same useEffect and API logic (unchanged)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const userId = user.user_id;
        const userPhone = userData.phone_number;
        let url =
          "https://backendapi.trakky.in/salons/booking/?section=current&is_payment_done=true";
        if (userId) url += `&salonuser=${userId}`;
        if (userPhone) url += `&user_phone=${userPhone}`;

        const bookingsResponse = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        });

        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
        const bookingsData = await bookingsResponse.json();

        const couponsResponse = await fetch(
          "https://backendapi.trakky.in/salons/coupon/",
          {
            method: "GET",
          }
        );

        if (!couponsResponse.ok) throw new Error("Failed to fetch coupons");
        const couponsData = await couponsResponse.json();

        setCurrentBookings(bookingsData);
        setCoupons(couponsData);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (authTokens) fetchAllData();
  }, [authTokens, user, userData]);

  // All handlers remain exactly the same
  const handleRescheduleClick = (booking) => {
    setSelectedBooking(booking);
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const services = selectedBooking.included_services
      ? Object.entries(selectedBooking.included_services)
          .map(([name]) => name)
          .join(", ")
      : "";

    const message = `Hi, I would like to reschedule my booking at ${
      selectedBooking.salon_name
    }, ${selectedBooking.salon_area}, ${
      selectedBooking.salon_city
    }.\n\nCurrent Booking Details:\n- Order ID: ${
      selectedBooking.id
    }\n- Current Date: ${new Date(
      selectedBooking.booking_date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}\n- Current Time: ${formatTimeToAMPM(
      selectedBooking.booking_time
    )}\n- Services: ${services}\n\nRequested New Schedule:\n- Date: ${formattedDate}\n- Time: ${selectedTime}\n\nPlease confirm if this slot is available.`;

    const whatsappLink = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappLink, "_blank");
    setRescheduleModalOpen(false);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedBooking(null);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setOpenCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    setIsCanceling(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/booking/${bookingToCancel.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!response.ok) throw new Error("Failed to cancel booking");
      toast.success("Booking canceled successfully");
      const bookingsResponse = await fetch(
        "https://backendapi.trakky.in/salons/booking/?section=current&is_payment_done=true" +
          (user?.user_id ? `&salonuser=${user.user_id}` : "") +
          (userData?.phone_number
            ? `&user_phone=${userData.phone_number}`
            : ""),
        {
          headers: { Authorization: `Bearer ${authTokens?.access_token}` },
        }
      );
      const updated = await bookingsResponse.json();
      setCurrentBookings(updated);
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setIsCanceling(false);
      setOpenCancelDialog(false);
      setBookingToCancel(null);
    }
  };

  const handleCancelDialogClose = () => {
    setOpenCancelDialog(false);
    setBookingToCancel(null);
  };

  const getCouponDetails = (couponId) => {
    if (!couponId) return null;
    return coupons.find((c) => c.id === couponId) || null;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (loading) {
    return (
    <div className="w-full  mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-200 border-t-[#3F2386] rounded-full animate-spin mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-lg">Loading your Current history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 text-lg font-medium">
        Error: {error}
      </div>
    );
  }

  if (currentBookings.length === 0) {
    return (
      <div className="mt-5 bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <p className="text-gray-600 text-lg font-medium">
          You don't have any current bookings.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* RESCHEDULE MODAL - HIGHEST Z-INDEX */}
      {/* RESCHEDULE MODAL - AB YE SABSE UPAR RAHEGA HI RAHEGA */}
      {rescheduleModalOpen && (
        <ModalPortal>
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 999999999 }} // inline style se force kar diya
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-75"
              onClick={() => {
                setRescheduleModalOpen(false);
                setSelectedBooking(null);
                setSelectedDate("");
                setSelectedTime("");
              }}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-xl -5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-[#3F2386] text-white p-6 rounded-t-xl z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Reschedule Booking </h2>
                  </div>
                  <button
                    onClick={() => {
                      setRescheduleModalOpen(false);
                      setSelectedBooking(null);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  >
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Body - same as before */}
              <div className="p-6 space-y-6">
                {/* Sab kuch same rahega... */}
                {selectedBooking && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold flex items-center mb-2">
                        Current Booking Details
                    </h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium text-gray-600">
                          Salon:
                        </span>{" "}
                        {selectedBooking.salon_name}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Services:
                        </span>{" "}
                        {Object.keys(
                          selectedBooking.included_services || {}
                        ).join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <div className="border rounded-lg p-4">
                  <label className="flex items-center gap-2 font-medium mb-3">
                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                    Select New Date
                  </label>
                  <input
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Time Slots */}
                <div className="border rounded-lg p-4">
                  <label className="flex items-center gap-2 font-medium mb-3">
                    <TimeIcon className="w-5 h-5 text-purple-600" />
                    Select Preferred Time
                  </label>
                 <div className="grid grid-cols-3 gap-3">
  {[
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ].map((time) => {

    // Convert to 24-hour
    const hour = (() => {
      const [t, mer] = time.split(" ");
      let h = parseInt(t.split(":")[0]);
      if (mer === "PM" && h !== 12) h += 12;
      if (mer === "AM" && h === 12) h = 0;
      return h;
    })();

    const currentHour = new Date().getHours();
    const isDisabled = hour <= currentHour;

    return (
      <button
        key={time}
        disabled={isDisabled}
        onClick={() => !isDisabled && setSelectedTime(time)}
        className={`py-3 rounded-lg border-2 font-medium transition
          ${
            isDisabled
              ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
              : selectedTime === time
              ? "bg-[#3F2386] text-white border-[#3F2386]"
              : "border-gray-400 hover:border-purple-400 border-dashed"
          }`}
      >
        {time}
      </button>
    );
  })}
</div>

                </div>

                {/* Footer */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setRescheduleModalOpen(false);
                      setSelectedBooking(null);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="flex-1 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRescheduleSubmit}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 py-3 bg-[#3F2386] text-white rounded-lg hover:bg-[#4D2B9E] disabled:opacity-50 font-medium"
                  >
                    Submit 
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* CANCEL DIALOG - YE BHI UPAR HI RAHEGA */}
      {openCancelDialog && (
        <ModalPortal>
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 999999998 }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-60"
              onClick={handleCancelDialogClose}
            />
            <div className="relative bg-white rounded-xl p-6 -3xl w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-3">Cancel Booking?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDialogClose}
                  className="flex-1 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 font-medium"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={isCanceling}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  {isCanceling ? "Canceling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
      {/* MAIN CONTENT - NO Z-INDEX ISSUE NOW */}
      <div className="-4xl mx-auto space-y-8">
        {currentBookings.map((booking) => {
          const services = booking.included_services
            ? Object.entries(booking.included_services)
            : [];

          const couponDetails = getCouponDetails(booking.coupon);
          const hasCouponApplied =
            booking.has_promo_code && booking.coupon !== null;

          return (
            <div
              key={booking.id}
              className="bg-white border-2 border-gray-300 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Same card content as before - unchanged */}
              <div className="bg-[#3F2386] text-white p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {booking.salon_name}
                      </h1>
                      <p className="text-sm opacity-90 flex items-center mt-1">
                        <LocationIcon className="w-4 h-4 mr-1" />
                        {booking.salon_area}, {booking.salon_city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Booking ID</p>
                    <p className="text-lg font-bold">#{booking.id}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CalendarIcon className="w-4 h-4 text-[#3F2386]" />
                    <span className="font-medium">Date:</span>
                    <span>
                      {new Date(booking.booking_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <TimeIcon className="w-4 h-4 text-[#3F2386]" />
                    <span className="font-medium">Time:</span>
                    <span>{formatTimeToAMPM(booking.booking_time)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4"></div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <TicketsIcon className="w-5 h-5 mr-2 text-[#3F2386]" />
                    Services Booked
                  </h3>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-700">
                            Service
                          </th>
                          <th className="text-right p-3 font-medium text-gray-700">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map(([serviceName, serviceDetails]) => {
                          const offerDetails =
                            booking.profileoffer_details?.find(
                              (o) => o.name === serviceName
                            );
                          return (
                            <tr
                              key={serviceName}
                              className="border-b border-gray-200"
                            >
                              <td className="p-3">
                                <div className="font-medium text-gray-800">
                                  {serviceName}
                                </div>
                                {offerDetails && (
                                  <div className="text-xs text-gray-500">
                                    Original: ₹{offerDetails.actual_price}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-right font-semibold text-gray-800">
                                ₹{serviceDetails.price}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <PaymentIcon className="w-5 h-5 mr-2 text-[#3F2386]" />
                    Payment Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold text-gray-800">
                        ₹{booking.total_booking_amount || 0}
                      </span>
                    </div>
                    {hasCouponApplied && couponDetails && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>
                          Discount Applied ({couponDetails.couponname})
                        </span>
                        <span>- ₹{couponDetails.discount_value}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-semibold text-green-600">
                        ₹{booking.total_amount_paid || 0}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="font-semibold text-gray-800">
                        Remaining
                      </span>
                      <span className="font-bold text-[#3F2386] text-lg">
                        ₹
                        {(
                          Number(booking.total_booking_amount) -
                          Number(booking.total_amount_paid)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.status !== "cancelled" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-300">
                    <button
                      onClick={() => handleRescheduleClick(booking)}
                      className="flex-1 bg-[#3F2386] text-white py-3 rounded-md hover:bg-[#4D2B9E] transition font-medium text-sm"
                    >
                      Reschedule Booking
                    </button>
                    <button
                      onClick={() => handleCancelClick(booking)}
                      className="flex-1 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition font-medium text-sm"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="text-center py-4">
                    <span className="inline-block bg-red-100 text-red-700 px-6 py-2 rounded-full text-sm font-semibold">
                      Booking Cancelled
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gray-100 px-6 py-3 text-xs text-gray-500 text-center border-t border-gray-300">
                Thank you for choosing us! For support, contact us on WhatsApp.
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CurrentBooking;
