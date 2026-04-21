import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import DateRange from "./DateRange/CustomDateRange";
import { formatDate } from "./DateRange/formatDate";
import axios from "axios";

const BookingHistoryModal = ({ open, onClose, phoneNumber, bookings }) => {
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Fetch coupons data
  useEffect(() => {
    const GetdataForCoupons = async () => {
      setLoadingCoupons(true);
      try {
        const response = await fetch("https://backendapi.trakky.in/salons/coupon/", {
          method: "GET",
        });
        if (response.ok) {
          const couponsData = await response.json();
          setCoupons(couponsData);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoadingCoupons(false);
      }
    };

    if (open) {
      GetdataForCoupons();
    }
  }, [open]);

  if (!open) return null;

  // Function to get coupon details by ID
  const getCouponDetails = (couponId) => {
    return coupons.find(coupon => coupon.id === couponId);
  };

  // Function to calculate discount amount
  const calculateDiscount = (booking) => {
    if (!booking.has_promo_code || !booking.coupon) return 0;
    
    const coupon = getCouponDetails(booking.coupon);
    if (!coupon) return 0;

    return coupon.discount_value || 0;
  };

  // Function to get original total before discount
  const GetOriginalTotal = (booking) => {
    let serviceTotal = 0;
    
    // Calculate from included_services
    if (booking.included_services && typeof booking.included_services === 'object') {
      Object.values(booking.included_services).forEach(service => {
        serviceTotal += service.price || 0;
      });
    }
    
    // Calculate from profileoffer_details
    if (booking.profileoffer_details && booking.profileoffer_details.length > 0) {
      booking.profileoffer_details.forEach(offer => {
        serviceTotal += offer.actual_price || 0;
      });
    }

    return serviceTotal;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Booking History for {phoneNumber}
            </h2>
            <p className="text-gray-700 mt-1">
              Total Bookings: {bookings.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No booking history found for this customer</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const discountAmount = calculateDiscount(booking);
                const originalTotal = GetOriginalTotal(booking);
                const couponDetails = booking.coupon ? getCouponDetails(booking.coupon) : null;

                return (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    {/* Booking Header */}
                    <div className="flex justify-between items-start mb-4  ">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Booking #{booking.id}</h3>
                        <p className="text-sm text-gray-600">{booking.salon_name} • {booking.salon_area}, {booking.salon_city}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Booking Date</p>
                        <p className="text-sm text-gray-900">{formatDate(new Date(booking.booking_date))}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Booking Time</p>
                        <p className="text-sm text-gray-900">{booking.booking_time}</p>
                      </div>
                    </div>

                   

                    {/* Offers Section */}
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Offers</h4>
                      {booking.profileoffer_details && booking.profileoffer_details.length > 0 ? (
                        <div className="space-y-2">
                          {booking.profileoffer_details.map((offer, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{offer.name}</p>
                                <p className="text-xs text-gray-500">
                                  Original: ₹{offer.actual_price} | Discounted: ₹{offer.discount_price}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#502DA6]">₹{offer.discount_price}</p>
                                <p className="text-xs text-gray-500 line-through">₹{offer.actual_price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No offers applied</p>
                      )}
                    </div>

                     {/* Services Section */}
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Services</h4>
                      {booking.included_services && typeof booking.included_services === 'object' && Object.keys(booking.included_services).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(booking.included_services).map(([serviceName, serviceDetails], index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{serviceName}</p>
                                <p className="text-xs text-gray-500">Duration: {serviceDetails.duration}</p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">₹{serviceDetails.price}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No services listed</p>
                      )}
                    </div>

                    {/* Coupon and Discount Section */}
                    {booking.has_promo_code && couponDetails && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-md font-semibold text-green-800 mb-2">Coupon Applied</h4>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-green-800">{couponDetails.couponname}</p>
                            <p className="text-xs text-green-600">{couponDetails.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">-₹{discountAmount}</p>
                            <p className="text-xs text-greenw-600">Discount Applied</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pricing Summary */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        {originalTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Original Total:</span>
                            <span className="text-gray-900">₹{originalTotal}</span>
                          </div>
                        )}
                        
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Coupon Discount:</span>
                            <span className="text-green-600">-₹{discountAmount}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-gray-900">Total Booking Amount:</span>
                          <span className="text-gray-900">₹{booking.total_booking_amount || 0}</span>
                        </div>

                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-[#502DA6]">Amount Paid:</span>
                          <span className="text-[#502DA6]">₹{booking.total_amount_paid || 0}</span>
                        </div>

                        {booking.total_booking_amount > booking.total_amount_paid && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Remaining Amount:</span>
                            <span className="text-orange-600">
                              ₹{booking.total_booking_amount - booking.total_amount_paid}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`font-medium ${
                          booking.is_payment_done ? "text-green-600" : "text-red-600"
                        }`}>
                          {booking.is_payment_done ? "Completed" : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-600">Booking Created:</span>
                        <span className="text-gray-500">
                          {new Date(booking.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OfferImagesModal = ({ open, onClose, offers }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">Offer Images</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🖼️</div>
              <p className="text-gray-500 text-lg">No images available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sm font-medium text-gray-900 text-center">{offer.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DateRangeModal = ({ open, onClose, dateState, setDateState, setIsDateFilterOn }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Select Date Range</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            setIsDateFilterOn={setIsDateFilterOn}
          />
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsDateFilterOn(true);
              onClose();
            }}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

const SalonOfferBooking = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [uniquePhoneBookings, setUniquePhoneBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [isDateFilterOn, setIsDateFilterOn] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchOption, setSearchOption] = useState("salonName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [bookingHistoryModal, setBookingHistoryModal] = useState(false);
  const [customerBookingHistory, setCustomerBookingHistory] = useState([]);
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState("");
  const [offerImagesModal, setOfferImagesModal] = useState(false);
  const [selectedOfferImages, setSelectedOfferImages] = useState([]);

  const statusFilters = [
    { name: "all", label: "All Bookings", color: "primary" },
    { name: "completed", label: "Completed", color: "success" },
    { name: "pending", label: "Pending", color: "warning" },
    { name: "cancelled", label: "Cancelled", color: "error" },
  ];

  const searchOptions = [
    { value: "salonName", label: "Salon Name" },
    { value: "city", label: "City" },
    { value: "area", label: "Area" },
    { value: "phone", label: "Phone" },
    { value: "offerName", label: "Offer Name" },
  ];

  // All the existing logic functions remain exactly the same
  const fetchRazorpayPayments = async () => {
    try {
      const response = await axios.get(
        "https://backendapi.trakky.in/salons/razorpay-payments/",
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.items || response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment details");
      return [];
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [bookingsResponse, payments] = await Promise.all([
        fetch(`https://backendapi.trakky.in/salons/booking/`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        }),
        fetchRazorpayPayments(),
      ]);

      if (bookingsResponse.status === 200) {
        const bookingsData = await bookingsResponse.json();
        const sortedBookings = bookingsData.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        const bookingsWithPayments = sortedBookings.map((booking) => {
          const payment = payments.find((p) => {
            if (!p.contact || !booking.user_phone) return false;
            const paymentPhone = p.contact
              .replace("+91", "")
              .replace(/\s/g, "");
            const bookingPhone = booking.user_phone
              .replace("+91", "")
              .replace(/\s/g, "");
            return paymentPhone === bookingPhone;
          });

          return {
            ...booking,
            razorpay_payment: payment
              ? {
                  amount: payment.amount / 100,
                  status: payment.status,
                  method: payment.method,
                  payment_id: payment.id,
                }
              : null,
          };
        });

        setBookings(bookingsWithPayments);
        const uniquePhones = new Set();
        const uniqueBookings = bookingsWithPayments.filter((booking) => {
          if (!booking.user_phone || uniquePhones.has(booking.user_phone)) {
            return false;
          }
          uniquePhones.add(booking.user_phone);
          return true;
        });

        setUniquePhoneBookings(uniqueBookings);
        setFilteredBookings(uniqueBookings);
      } else if (bookingsResponse.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(
          `Error: ${bookingsResponse.status} - ${bookingsResponse.statusText}`
        );
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [
    searchTerm,
    dateState,
    isDateFilterOn,
    statusFilter,
    uniquePhoneBookings,
  ]);

  const handleSearch = () => {
    let filtered = [...uniquePhoneBookings];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((booking) => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchOption) {
          case "salonName":
            return (booking.salon_name || "")
              .toLowerCase()
              .includes(searchValue);
          case "city":
            return (booking.salon_city || "")
              .toLowerCase()
              .includes(searchValue);
          case "area":
            return (booking.salon_area || "")
              .toLowerCase()
              .includes(searchValue);
          case "phone":
            return (booking.user_phone || "")
              .toLowerCase()
              .includes(searchValue);
          case "offerName":
            return booking.profileoffer_details.some((offer) =>
              (offer.name || "").toLowerCase().includes(searchValue)
            );
          default:
            return true;
        }
      });
    }

    if (isDateFilterOn && dateState[0].startDate && dateState[0].endDate) {
      const startDate = new Date(dateState[0].startDate);
      const endDate = new Date(dateState[0].endDate);

      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.booking_date);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    filtered.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    setFilteredBookings(filtered);
    setPage(0);
  };

  const handleViewBookingHistory = (phoneNumber) => {
    if (!phoneNumber) return;
    const customerBookings = bookings.filter(
      (booking) => booking.user_phone === phoneNumber
    );
    setCustomerBookingHistory(customerBookings);
    setSelectedCustomerPhone(phoneNumber);
    setBookingHistoryModal(true);
  };

  const handleViewOfferImages = (offerDetails) => {
    setSelectedOfferImages(offerDetails);
    setOfferImagesModal(true);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedBookings.map((booking) => booking.id);
      setSelectedBookings(newSelected);
      return;
    }
    setSelectedBookings([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedBookings.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedBookings, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedBookings.slice(1));
    } else if (selectedIndex === selectedBookings.length - 1) {
      newSelected = newSelected.concat(selectedBookings.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedBookings.slice(0, selectedIndex),
        selectedBookings.slice(selectedIndex + 1)
      );
    }

    setSelectedBookings(newSelected);
  };

  const isSelected = (id) => selectedBookings.indexOf(id) !== -1;

  const clearSelection = () => {
    setSelectedBookings([]);
  };

  const getStatistics = () => {
    const total = filteredBookings.length;
    const completed = filteredBookings.filter(
      (b) => b.status === "completed"
    ).length;
    const pending = filteredBookings.filter(
      (b) => b.status === "pending"
    ).length;
    const cancelled = filteredBookings.filter(
      (b) => b.status === "cancelled"
    ).length;
    const totalRevenue = filteredBookings.reduce((sum, booking) => {
      if (booking.status === "completed" && booking.profileoffer_details.length > 0) {
        return sum + booking.profileoffer_details.reduce(
          (offerSum, offer) => offerSum + (offer.discount_price || 0),
          0
        );
      }
      return sum;
    }, 0);

    return { total, completed, pending, cancelled, totalRevenue };
  };

  const stats = getStatistics();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const clearDateFilter = () => {
    setDateState([{ startDate: null, endDate: null, key: "selection" }]);
    setIsDateFilterOn(false);
  };

  const isSelectionMode = selectedBookings.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      />

    {/* Header Section */}
<div className="mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
  <div className="bg-gradient-to-r from-[#502DA6] to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 text-white">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
      
      {/* Left Section - Title and Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            Offerpage Booking History
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 opacity-90">
            Manage and monitor salon bookings and offers
          </p>
        </div>
        
        {isSelectionMode && (
          <span className="inline-flex items-center self-start sm:self-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500 text-white text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2"></span>
            {selectedBookings.length} Selected
          </span>
        )}
      </div>

      {/* Right Section - Refresh Button */}
      <button
        onClick={fetchBookings}
        className="flex items-center justify-center w-full lg:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors text-sm sm:text-base"
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        <span>Refresh</span>
      </button>

    </div>
  </div>
</div>

      {/* Statistics Cards */}
      <div className=" mx-auto px-4  mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#502DA6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className=" mx-auto px-4  mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-2">
              <select
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {searchOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${searchOptions.find(o => o.value === searchOption)?.label}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <button
                onClick={() => setShowDateSelectionModal(true)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                  isDateFilterOn
                    ? "bg-[#502DA6] text-white border-[#502DA6]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isDateFilterOn ? "Date Filter Active" : "Filter by Date"}
              </button>
            </div>

            <div className="md:col-span-3">
              {isDateFilterOn && (
                <button
                  onClick={clearDateFilter}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setStatusFilter(filter.name)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === filter.name
                      ? `bg-indigo-700 text-white`
                      : `bg-white text-${filter.color}-600 border border-${filter.color}-600 hover:bg-${filter.color}-50`
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Bookings Bar */}
      {isSelectionMode && (
        <div className=" mx-auto px-4  mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedBookings.length} selected
                </span>
                <button
                  onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    showSelectedOnly
                      ? "bg-[#502DA6] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showSelectedOnly ? "Show All" : "Show Selected"}
                </button>
                <button
                  onClick={() => toast.error("Delete selected not implemented yet")}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => {
                  setShowSelectedOnly(false);
                  clearSelection();
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className=" mx-auto px-4 ">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedBookings.length > 0 && selectedBookings.length === paginatedBookings.length}
                      onChange={handleSelectAllClick}
                      className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking History</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Names</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Prices</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discounted Prices</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Has Promo Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Booking Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid (Online)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Our Side)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Salon Side)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={21} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#502DA6]"></div>
                        <span className="text-gray-600">Loading bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : (showSelectedOnly
                    ? paginatedBookings.filter((booking) => selectedBookings.includes(booking.id))
                    : paginatedBookings
                  ).length === 0 ? (
                  <tr>
                    <td colSpan={21} className="px-4 py-12 text-center">
                      <div className="text-gray-500 text-lg">
                        {showSelectedOnly ? "No selected bookings found" : "No bookings found matching your criteria"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  (showSelectedOnly
                    ? paginatedBookings.filter((booking) => selectedBookings.includes(booking.id))
                    : paginatedBookings
                  ).map((booking, index) => {
                    const isItemSelected = isSelected(booking.id);
                    return (
                      <tr
                        key={booking.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          isItemSelected ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isItemSelected}
                            onChange={(event) => handleCheckboxClick(event, booking.id)}
                            className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {page * rowsPerPage + index + 1}
                        </td>

                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {booking.salon_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.salon_city}, {booking.salon_area}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.user_name || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.user_phone || "N/A"}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewBookingHistory(booking.user_phone)}
                            disabled={!booking.user_phone}
                            className="px-3 py-1 border border-[#502DA6] text-[#502DA6] rounded-lg hover:bg-indigo-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Booking Info
                          </button>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <div>{formatDate(new Date(booking.booking_date))}</div>
                            <div className="text-xs text-gray-500">{booking.booking_time}</div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {booking.profileoffer_details.length > 0 ? (
                            <button
                              onClick={() => handleViewOfferImages(booking.profileoffer_details)}
                              className="p-2 text-[#502DA6] hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {booking.profileoffer_details.length > 0 ? (
                            <div className="space-y-1">
                              {booking.profileoffer_details.map((offer, idx) => (
                                <div key={idx} className="text-sm text-gray-900">
                                  {offer.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {booking.profileoffer_details.length > 0 ? (
                            <div className="space-y-1">
                              {booking.profileoffer_details.map((offer, idx) => (
                                <div key={idx} className="text-sm text-gray-500 line-through">
                                  ₹{offer.actual_price}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {booking.profileoffer_details.length > 0 ? (
                            <div className="space-y-1">
                              {booking.profileoffer_details.map((offer, idx) => (
                                <div key={idx} className="text-sm font-semibold text-[#502DA6]">
                                  ₹{offer.discount_price}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.has_promo_code ? "Yes" : "No"}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.coupon || "-"}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.is_gst_applied ? "Yes" : "No"}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {booking.total_booking_amount > 0 ? `₹${booking.total_booking_amount}` : "-"}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-[#502DA6]">
                          {booking.total_amount_paid > 0 ? `₹${booking.total_amount_paid}` : "-"}
                        </td>

                        <td className="px-4 py-3">
                          {booking.razorpay_payment ? (
                            <div>
                              <div className="text-sm font-semibold text-[#502DA6]">
                                ₹{booking.razorpay_payment.amount}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.razorpay_payment.method} • {booking.razorpay_payment.status}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not paid online</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {booking.razorpay_payment && booking.profileoffer_details.length > 0 ? (
                            <div className="text-sm font-semibold text-[#502DA6]">
                              ₹{Math.abs(
                                booking.razorpay_payment.amount -
                                  booking.profileoffer_details.reduce(
                                    (sum, offer) => sum + (offer.discount_price || 0),
                                    0
                                  )
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not paid in salon</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Incomplete
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[5, 10, 25].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {Math.ceil(filteredBookings.length / rowsPerPage)}
                </span>
                <button
                  onClick={(e) => handleChangePage(e, page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={(e) => handleChangePage(e, page + 1)}
                  disabled={page >= Math.ceil(filteredBookings.length / rowsPerPage) - 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DateRangeModal
        open={showDateSelectionModal}
        onClose={() => setShowDateSelectionModal(false)}
        dateState={dateState}
        setDateState={setDateState}
        setIsDateFilterOn={setIsDateFilterOn}
      />

      <BookingHistoryModal
        open={bookingHistoryModal}
        onClose={() => setBookingHistoryModal(false)}
        phoneNumber={selectedCustomerPhone}
        bookings={customerBookingHistory}
      />

      <OfferImagesModal
        open={offerImagesModal}
        onClose={() => setOfferImagesModal(false)}
        offers={selectedOfferImages}
      />
    </div>
  );
};

export default SalonOfferBooking;