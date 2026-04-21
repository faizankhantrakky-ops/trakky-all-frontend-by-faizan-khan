import React, { useState, useContext, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CreditCardIcon,
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  CheckIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/Auth";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../BookingModule/BookingModule.css";
import {
  BadgePercentIcon,
  ChevronDown,
  ArrowLeft,
  Check,
  Loader,
  TicketPercent,
  ChevronUp,
  X,
  Wallet,
  MessageCircle,
} from "lucide-react";
import {
  ChevronLeftSharp,
  ArrowBack,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmptyCart from "../../Assets/images/other/Untitled design.png";

const BookingModule = ({
  isOpen,
  closeModal,
  selectedServices,
  setSelectedServices,
  salon,
}) => {
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [bookingType] = useState("advance");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isGstApplied, setIsGstApplied] = useState(false);
  const [showCouponPage, setShowCouponPage] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Video states
  const [playingVideos, setPlayingVideos] = useState({});
  const [mutedVideos, setMutedVideos] = useState({});
  const videoRefs = useRef({});

  const navigate = useNavigate();
  const params = useParams();
  const { user, authTokens, userData, fetchUserData } = useContext(AuthContext);
  const salonOpeningHour = 10;
  const salonClosingHour = 20;

  // Update URL with booking parameter when showing payment summary
  useEffect(() => {
    if (showPaymentSummary && isOpen) {
      const currentUrl = window.location.href;
      if (!currentUrl.includes("?booking=true")) {
        const newUrl = currentUrl + "?booking=true";
        window.history.pushState({}, "", newUrl);
      }
    } else if (!showPaymentSummary && isOpen && window.location.href.includes("?booking=true")) {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace("?booking=true", "");
      window.history.pushState({}, "", newUrl);
    }
  }, [showPaymentSummary, isOpen]);

  // Handle browser back button to go back to booking summary
  useEffect(() => {
    const handlePopState = () => {
      if (showPaymentSummary && isOpen) {
        setShowPaymentSummary(false);
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showPaymentSummary, isOpen]);

  // Handle WhatsApp message with booking details
  const handleWhatsAppInfo = async () => {
    if (!bookingDate || !selectedTime) {
      toast.error("Please select date and time first");
      return;
    }

    // Get service details
    const serviceNames = selectedServices.map(service => 
      service.service_name || service.name
    ).join(", ");
    
    const firstService = selectedServices[0];
    const salonName = salon?.name || firstService?.salon_name || "Salon";
    const location = params?.city && params?.area ? `${params.area}, ${params.city}` : "Ahmedabad";
    
    // Calculate total
    const total = calculateTotal();
    
    // Create message text
    const message = `Can you provide more details about '${serviceNames}' at ${salonName} in ${location}?\n\nBooking Details:\n• Date: ${new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}\n• Time: ${selectedTime}\n• Services: ${serviceNames}\n• Total Amount: ₹${total.finalAmountAfterWallet.toFixed(2)} \n\nPlease provide more information about this booking.`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=916355167304&text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  // Fetch user wallet balance
  const fetchWalletBalance = async () => {
    try {
      setLoadingWallet(true);
      const response = await fetch(
        `https://backendapi.trakky.in/salons/salonuser/${user?.user_id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }

      const userData = await response.json();
      const balance = userData?.coin_wallet?.coin_balance || 0;
      setWalletBalance(balance);
      return balance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setWalletBalance(0);
      return 0;
    } finally {
      setLoadingWallet(false);
    }
  };

  // Fetch dynamic coupons from API
  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const response = await fetch(
        "https://backendapi.trakky.in/salons/coupon/",
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      const couponsData = await response.json();

      // Transform API data to match our format
      const transformedCoupons = couponsData.map((coupon) => ({
        id: coupon.id,
        code: coupon.couponcode,
        discount: coupon.discount_value,
        type: coupon.coupon_choice === "percentage" ? "percentage" : "fixed",
        description: coupon.description || coupon.couponname,
        couponname: coupon.couponname,
        starting_date: coupon.starting_date,
        expire_date: coupon.expire_date,
        active_status: coupon.active_status,
        priority: coupon.priority,
        terms: `Valid from ${new Date(coupon.starting_date).toLocaleDateString()} to ${new Date(coupon.expire_date).toLocaleDateString()}`,
        minAmount: 0,
        maxDiscount:
          coupon.coupon_choice === "percentage"
            ? coupon.discount_value * 10
            : coupon.discount_value,
      }));
      setAvailableCoupons(transformedCoupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Check coupon validity
  const isCouponValid = (coupon) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.starting_date);
    const expireDate = new Date(coupon.expire_date);

    return (
      coupon.active_status &&
      currentDate >= startDate &&
      currentDate <= expireDate
    );
  };

  // Get coupon status text and color
  const getCouponStatus = (coupon) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.starting_date);
    const expireDate = new Date(coupon.expire_date);
    if (!coupon.active_status) {
      return { text: "Inactive", color: "text-red-500", bg: "bg-red-50" };
    }
    if (currentDate < startDate) {
      return {
        text: `Starts ${startDate.toLocaleDateString()}`,
        color: "text-blue-500",
        bg: "bg-blue-50",
      };
    }
    if (currentDate > expireDate) {
      return { text: "Expired", color: "text-red-500", bg: "bg-red-50" };
    }
    return {
      text: `Valid until ${expireDate.toLocaleDateString()}`,
      color: "text-green-500",
      bg: "bg-green-50",
    };
  };

  // Check if content is video
  const isVideoContent = (url) => {
    if (!url) return false;
    return (
      url.includes(".mp4") ||
      url.includes(".webm") ||
      url.includes(".mov") ||
      url.includes("video/")
    );
  };

  // Video control functions
  const toggleVideoPlay = (serviceId) => {
    const video = videoRefs.current[serviceId];
    if (video) {
      if (playingVideos[serviceId]) {
        video.pause();
      } else {
        video.play().catch((error) => {
          console.log("Play failed:", error);
        });
      }
      setPlayingVideos((prev) => ({
        ...prev,
        [serviceId]: !prev[serviceId],
      }));
    }
  };

  const toggleMute = (serviceId) => {
    const video = videoRefs.current[serviceId];
    if (video) {
      video.muted = !video.muted;
      setMutedVideos((prev) => ({
        ...prev,
        [serviceId]: !prev[serviceId],
      }));
    }
  };

  const handleVideoEnd = (serviceId) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [serviceId]: false,
    }));
  };

  const handleVideoPlay = (serviceId) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [serviceId]: true,
    }));
  };

  const handleVideoPause = (serviceId) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [serviceId]: false,
    }));
  };

  // Cleanup videos when modal closes
  useEffect(() => {
    if (!isOpen) {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
        }
      });
      setPlayingVideos({});
    }
  }, [isOpen]);

  const calculatePayableAmount = (total) => {
    // Only take 11 rupees for advance payment regardless of total amount
    return 11;
  };

  const generateInstantBookingTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const removeService = (serviceId) => {
    if (selectedServices.length === 1) {
      setSelectedServices((prev) => {
        const updated = prev.filter((s) => s.id !== serviceId);
        if (updated.length === 0) {
          setTimeout(() => closeModal(), 0);
        }
        return updated;
      });
      return;
    }
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const handleQuantityChange = (serviceId, change) => {
    setSelectedServices((prev) => {
      const updated = prev
        .map((service) => {
          if (service.id === serviceId) {
            const newQuantity = (service.quantity || 1) + change;
            if (newQuantity < 1) return null;
            return { ...service, quantity: newQuantity };
          }
          return service;
        })
        .filter(Boolean);
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          const element = document.getElementById(`booking-item-${serviceId}`);
          if (element)
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
      }
      return updated;
    });
  };

  const handleBackClick = () => {
    if (showCouponPage) {
      setShowCouponPage(false);
    } else if (showPaymentSummary) {
      setShowPaymentSummary(false);
    } else {
      navigate("/")
      closeModal();
    }
  };

  useEffect(() => {
    if (window.innerWidth > 768) return;
    const handlePopState = () => {
      if (isOpen) {
        closeModal();
        const servicesSection = document.getElementById("salon-services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: "smooth" });
        }
        setTimeout(() => {
          window.history.pushState(null, "", window.location.href);
        }, 100);
      }
    };

    if (isOpen) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (isOpen) {
      setShowPaymentSummary(false);
      setShowCouponPage(false);
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      setBookingDate(formattedDate);
      generateTimeSlots(formattedDate);

      // Fetch wallet balance when modal opens
      if (user?.user_id) {
        fetchWalletBalance();
      }
    }
  }, [isOpen, user?.user_id]);

  const generateTimeSlots = (date) => {
    const isToday = date === new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalDuration =
      calculateDuration().hours * 60 + calculateDuration().minutes;
    const slots = [];
    let startHour = salonOpeningHour;
    let endHour = salonClosingHour;
    if (isToday) {
      startHour = currentHour;
      if (currentMinute > 30) {
        startHour += 1;
      }
      if (startHour + Math.ceil(totalDuration / 60) >= endHour) {
        startHour = endHour - Math.ceil(totalDuration / 60);
      }
      if (startHour < salonOpeningHour) startHour = salonOpeningHour;
    }
    const totalSlots = 6;
    const slotInterval = Math.max(
      1,
      Math.floor((endHour - startHour) / totalSlots),
    );
    for (
      let hour = startHour;
      hour < endHour && slots.length < totalSlots;
      hour += slotInterval
    ) {
      const minuteOptions = [0, 30];
      for (const minute of minuteOptions) {
        if (slots.length >= totalSlots) break;
        const slotEndHour = hour + Math.floor((minute + totalDuration) / 60);
        const slotEndMinute = (minute + totalDuration) % 60;
        if (
          slotEndHour > endHour ||
          (slotEndHour === endHour && slotEndMinute > 0)
        ) {
          continue;
        }
        const startAmPm = hour >= 12 ? "PM" : "AM";
        const startDisplayHour = hour % 12 || 12;
        const startDisplayMinute = minute < 10 ? "0" + minute : minute;
        const startTime = `${startDisplayHour}:${startDisplayMinute} ${startAmPm}`;
        const endAmPm = slotEndHour >= 12 ? "PM" : "AM";
        const endDisplayHour = slotEndHour % 12 || 12;
        const endDisplayMinute =
          slotEndMinute < 10 ? "0" + slotEndMinute : slotEndMinute;
        const endTime = `${endDisplayHour}:${endDisplayMinute} ${endAmPm}`;
        slots.push({
          start: startTime,
          end: endTime,
          rawStartHour: hour,
          rawStartMinute: minute,
        });
      }
    }
    setAvailableTimes(slots);
    setShowTimeSlots(true);
  };

  const handleDateChange = (date) => {
    setBookingDate(date);
    setSelectedTime("");
    generateTimeSlots(date);
  };

  // Calculate total with wallet balance and coupon
  const calculateTotal = () => {
    // Calculate subtotal (services total)
    const subtotal = selectedServices.reduce((sum, service) => {
      const quantity = service.quantity || 1;
      const price = service.price || 0;
      return sum + price * quantity;
    }, 0);

    // Apply coupon discount if selected and valid
    let discountAmount = 0;
    let finalAmountAfterDiscount = subtotal;
    if (selectedCoupon && isCouponValid(selectedCoupon)) {
      if (selectedCoupon.type === "percentage") {
        discountAmount = (subtotal * selectedCoupon.discount) / 100;
        if (
          selectedCoupon.maxDiscount &&
          discountAmount > selectedCoupon.maxDiscount
        ) {
          discountAmount = selectedCoupon.maxDiscount;
        }
      } else {
        discountAmount = selectedCoupon.discount;
      }
      finalAmountAfterDiscount = Math.max(0, subtotal - discountAmount);
    }

    // Apply wallet balance if selected
    let walletAmountUsed = 0;
    let finalAmountAfterWallet = finalAmountAfterDiscount;

    if (useWalletBalance && walletBalance > 0) {
      walletAmountUsed = Math.min(walletBalance, finalAmountAfterDiscount);
      finalAmountAfterWallet = Math.max(
        0,
        finalAmountAfterDiscount - walletAmountUsed,
      );
    }

    // Calculate payable amount (always 11 rupees as per requirement)
    const payableAmount =49;
    const convenienceFee = 0;

    // Calculate GST if applicable
    let gstAmount = 0;
    if (isGstApplied) {
      gstAmount = finalAmountAfterWallet * 0.18;
    }

    const totalWithGst = finalAmountAfterWallet + gstAmount;

    return {
      subtotal, // Original total without discount
      discount: discountAmount, // Coupon discount amount
      finalAmountAfterDiscount, // Amount after coupon discount
      walletAmountUsed, // Amount used from wallet
      finalAmountAfterWallet, // Final amount after all discounts
      total: totalWithGst, // Final total with GST
      payableAmount: payableAmount, // Advance payment amount (always 11)
      convenienceFee,
      gstAmount,
    };
  };

  const calculateDuration = () => {
    let totalMinutes = 0;
    selectedServices.forEach((service) => {
      if (service.service_time) {
        if (service.service_time.days)
          totalMinutes += service.service_time.days * 24 * 60;
        if (service.service_time.hours)
          totalMinutes += service.service_time.hours * 60;
        if (service.service_time.minutes)
          totalMinutes += service.service_time.minutes;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return {
      hours,
      minutes,
      formatted: `${hours > 0 ? `${hours}h ` : ""}${
        minutes > 0 ? `${minutes}m` : ""
      }`,
    };
  };

  const handleAddMoreServices = () => {
    closeModal();
    navigate(
      `/${encodeURIComponent(params?.city)}/${encodeURIComponent(
        params?.area,
      )}/salons/${encodeURIComponent(params?.slug)}`,
    );
  };

  // Coupon related functions
  const handleApplyCoupon = () => {
    fetchCoupons();
    setShowCouponPage(true);
  };

  const handleCouponSelect = (coupon) => {
    if (!isCouponValid(coupon)) {
      toast.error("This coupon is not valid or has expired");
      return;
    }

    const total = calculateTotal();

    setSelectedCoupon(coupon);
    setShowCouponPage(false);
    toast.success(
      `Coupon ${coupon.code} applied! You save ₹${total.discount.toFixed(2)}`,
    );
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    toast.success("Coupon removed successfully!");
  };

  // Wallet balance functions
  const handleWalletToggle = () => {
    if (walletBalance > 0) {
      setUseWalletBalance(!useWalletBalance);
      if (!useWalletBalance) {
        toast.success(`Wallet balance of ₹${walletBalance} will be applied`);
      } else {
        toast.success("Wallet balance removed");
      }
    } else {
      toast.error("No wallet balance available");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Updated: Proper booking confirmation with coupon and wallet management
  const confirmBooking = async (bookingPayload) => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/booking/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(bookingPayload),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || Object.values(errorData).join(", "),
        );
      }
      const responseData = await response.json();
      setBookingId(responseData.id);
      if (responseData.is_gst_applied) {
        setIsGstApplied(true);
      }
      return responseData;
    } catch (error) {
      console.error("Booking error:", error);
      throw error;
    }
  };

  // Updated: Handle booking with proper coupon and wallet data
  const handleBooking = async () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    if (!bookingDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    setIsProcessing(true);
    try {
      const formatTime = (timeStr) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        if (period === "PM" && hours !== "12") {
          hours = String(parseInt(hours) + 12);
        }
        if (period === "AM" && hours === "12") {
          hours = "00";
        }
        return `${hours}:${minutes}:00`;
      };

      const services = selectedServices
        .filter((service) => !service.isOffer)
        .map((service) => service.id);
      const profileOffers = selectedServices
        .filter((service) => service.isOffer)
        .map((service) => service.id);
      const includedServicesDetails = {};
      selectedServices.forEach((service) => {
        includedServicesDetails[service.service_name || service.name] = {
          price: service.price || 0,
          duration: service.service_time
            ? `${service.service_time.hours || 0}h ${
                service.service_time.minutes || 0
              }m`
            : "30m",
        };
      });

      // Calculate total amounts with discount and wallet
      const total = calculateTotal();

      // IMPORTANT: Prepare booking payload with coupon and wallet data
      const bookingPayload = {
        salon: salon?.id || selectedServices[0]?.salon,
        services: services,
        profile_offers: profileOffers,
        user: user?.id || null,
        salonuser: user?.user_id || null,
        included_services: includedServicesDetails,
        booking_date: bookingDate,
        booking_time: formatTime(selectedTime),
        booking_type: "advance",
        coupon: selectedCoupon?.id || null,

        // Coupon related fields
        has_promo_code: !!selectedCoupon,
        coupon_code: selectedCoupon ? selectedCoupon.code : null,
        discount_amount: total.discount,
        want_to_apply_coupon: !!selectedCoupon,

        // Wallet related fields
        wallet_balance_used: useWalletBalance ? total.walletAmountUsed : 0,
        use_wallet_balance: useWalletBalance,

        // Payment fields - USE FINAL AMOUNT AFTER ALL DISCOUNTS
        payment_status: "pending",
        total_booking_amount: total.finalAmountAfterWallet,
        total_amount_paid: 0,
        is_payment_done: false,
        status: "pending",
      };

      console.log("Booking Payload:", bookingPayload);
      const bookingResponse = await confirmBooking(bookingPayload);
      setBookingId(bookingResponse.id);
      setShowPaymentSummary(true);

      // Show success message with discount details
      let successMessage = "Booking confirmed successfully!";
      if (selectedCoupon && useWalletBalance) {
        successMessage = `Booking confirmed! Saved ₹${total.discount.toFixed(2)} with coupon and ₹${total.walletAmountUsed.toFixed(2)} from wallet`;
      } else if (selectedCoupon) {
        successMessage = `Booking confirmed with ${selectedCoupon.code} coupon! Discount: ₹${total.discount.toFixed(2)}`;
      } else if (useWalletBalance) {
        successMessage = `Booking confirmed! Used ₹${total.walletAmountUsed.toFixed(2)} from wallet balance`;
      }

      toast.success(successMessage);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Booking failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Updated: Update booking with payment using final amount after all discounts
  const updateBookingWithPayment = async (amountPaid) => {
    try {
      const total = calculateTotal();
      const updatePayload = {
        payment_status: "completed",
        total_booking_amount: total.finalAmountAfterWallet,
        total_amount_paid: amountPaid,
        is_payment_done: true,
        status: "completed",
      };
      const response = await fetch(
        `https://backendapi.trakky.in/salons/booking/${bookingId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(updatePayload),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || Object.values(errorData).join(", "),
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Update booking error:", error);
      throw error;
    }
  };

  const initiatePayment = async () => {
    setPaymentProcessing(true);
    try {
      // Calculate payable amount - always 11 rupees as per requirement
      const payableAmount = 11;

      // 1. Create Razorpay order
      const orderResponse = await fetch(
        "https://backendapi.trakky.in/salons/create-order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify({
            amount: payableAmount,
            currency: "INR",
          }),
        },
      );
      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }
      const orderData = await orderResponse.json();
      setRazorpayOrder(orderData);

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // 3. Initialize Razorpay checkout
      const options = {
        key: "rzp_test_bY7cqrXxuvknwU",
        amount: orderData.amount,
        currency: orderData.currency,
        name: salon?.name || "Salon Booking",
        description: "Booking Payment",
        image: salon?.image || "https://your-logo-url.png",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 4. Verify payment
            const verificationResponse = await fetch(
              "https://backendapi.trakky.in/salons/verify-payment/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authTokens.access_token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: payableAmount,
                  booking_id: bookingId,
                  status: "completed",
                }),
              },
            );
            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // 5. Update booking with payment details
            await updateBookingWithPayment(payableAmount);
            const total = calculateTotal();

            let successMessage = "Payment successful! Booking confirmed.";
            if (selectedCoupon && useWalletBalance) {
              successMessage = `Payment successful! You saved ₹${total.discount.toFixed(2)} with coupon and ₹${total.walletAmountUsed.toFixed(2)} from wallet`;
            } else if (selectedCoupon) {
              successMessage = `Payment successful! You saved ₹${total.discount.toFixed(2)} with ${selectedCoupon.code}`;
            } else if (useWalletBalance) {
              successMessage = `Payment successful! Used ₹${total.walletAmountUsed.toFixed(2)} from wallet`;
            }

            toast.success(successMessage, {
              style: {
                background: "#502DA6",
                color: "#fff",
                borderRadius: "8px",
                padding: "16px",
              },
            });

            navigate("/userProfile/my-bookings");
            closeModal();
            setSelectedServices([]);
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#502DA6",
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Render media content (image or video)
  const renderMediaContent = (service) => {
    const hasVideo = service?.video && isVideoContent(service.video);
    const mediaUrl = hasVideo
      ? service.video
      : service?.service_image || service?.image;
    const posterUrl = service?.video_thumbnail_image || service?.image;
    const serviceId = service.id;
    if (hasVideo) {
      return (
        <div className="media-container relative rounded-lg overflow-hidden w-full h-full">
          <video
            ref={(el) => (videoRefs.current[serviceId] = el)}
            className="w-full h-full object-cover"
            poster={posterUrl}
            onEnded={() => handleVideoEnd(serviceId)}
            onPlay={() => handleVideoPlay(serviceId)}
            onPause={() => handleVideoPause(serviceId)}
            onClick={(e) => {
              e.stopPropagation();
              toggleVideoPlay(serviceId);
            }}
            playsInline
            muted={mutedVideos[serviceId] !== false}
            loop
          >
            <source src={mediaUrl} type="video/mp4" />
            <source src={mediaUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {/* Video Overlay Controls */}
          <div
            className={`video-overlay absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
              playingVideos[serviceId]
                ? "opacity-0 hover:opacity-100"
                : "opacity-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleVideoPlay(serviceId);
            }}
          >
            {!playingVideos[serviceId] && (
              <div className="play-button bg-black bg-opacity-60 rounded-full p-2 transition-all duration-300 hover:bg-opacity-80">
                <PlayArrow style={{ color: "white", fontSize: "24px" }} />
              </div>
            )}
          </div>
          {/* Video Controls */}
          <div
            className={`video-controls absolute bottom-2 left-2 right-2 flex justify-between items-center transition-opacity duration-300 ${
              playingVideos[serviceId] ? "opacity-100" : "opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2">
              <button
                className="control-btn bg-black bg-opacity-50 rounded-full p-1"
                onClick={() => toggleVideoPlay(serviceId)}
              >
                {playingVideos[serviceId] ? (
                  <Pause style={{ color: "white", fontSize: "16px" }} />
                ) : (
                  <PlayArrow style={{ color: "white", fontSize: "16px" }} />
                )}
              </button>
              <button
                className="control-btn bg-black bg-opacity-50 rounded-full p-1"
                onClick={() => toggleMute(serviceId)}
              >
                {mutedVideos[serviceId] !== false ? (
                  <VolumeOff style={{ color: "white", fontSize: "16px" }} />
                ) : (
                  <VolumeUp style={{ color: "white", fontSize: "16px" }} />
                )}
              </button>
            </div>
          </div>
          {/* Video Indicator */}
          <div className="video-indicator absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            VIDEO
          </div>
        </div>
      );
    } else {
      // Image content
      return (
        <img
          src={mediaUrl}
          alt={service.service_name || service.name}
          className="w-full h-full object-cover"
        />
      );
    }
  };

  // Coupon Ticket Component
  const CouponTicket = ({ coupon, onSelect, isSelected }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const status = getCouponStatus(coupon);
    const isValid = isCouponValid(coupon);

    return (
      <div className="relative">
        {/* Main Coupon Card */}
        <div
          className={`relative bg-white border-2 border-dashed cursor-pointer transition-all duration-200 rounded-lg overflow-hidden
            ${
              isSelected
                ? "border-[#502DA6] bg-[#f9f5ff]"
                : isValid
                  ? "border-green-400 hover:border-green-600"
                  : "border-gray-300 opacity-60"
            }`}
          onClick={() => isValid && !isExpanded && onSelect(coupon)}
        >
          {/* Side notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1">
            <div className="w-3 h-7 bg-white border-r-2 border-gray-300 rounded-full"></div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1">
            <div className="w-3 h-7 bg-white border-l-2 border-gray-300 rounded-full"></div>
          </div>

          <div className="py-3 px-4">
            {/* Top: Selected Check */}
            <div className="flex items-center justify-between mb-1">
              {isSelected && (
                <div className="w-5 h-5 bg-[#502DA6] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Discount + Min Purchase */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span
                  className={`text-2xl font-black ${isValid ? "text-[#502DA6]" : "text-gray-400"}`}
                >
                  {coupon.type === "percentage"
                    ? `${coupon.discount}%`
                    : `₹${coupon.discount}`}
                </span>
                <span className="text-sm font-semibold text-gray-700">OFF</span>
                {coupon.minAmount && coupon.minAmount > 0 && (
                  <span className="text-xs text-gray-500">
                    • min ₹{coupon.minAmount.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* Expiry */}
            {coupon.expire_date && (
              <div
                className={`text-[10px] text-center mt-1 ${isValid ? "text-gray-500" : "text-gray-400"}`}
              >
                Expires{" "}
                {new Date(coupon.expire_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            )}

            {/* Status + Clickable T&C */}
            <div className="flex items-center justify-center gap-3 mt-2">
              {status && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.color}`}
                >
                  {status.text}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="flex items-center gap-1 text-[9px] font-medium text-[#502DA6] hover:underline"
              >
                T&C
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Selected Bottom Bar */}
          {isSelected && coupon.maxDiscount && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-[#502DA6] to-[#3d2180] text-white text-center py-2 text-sm font-bold">
              Save up to ₹{coupon.maxDiscount}
            </div>
          )}
        </div>

        {/* Expandable T&C Div */}
        {isExpanded && (
          <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
            {coupon.description && (
              <p className="font-medium text-[#502DA6] mb-3">
                {coupon.description}
              </p>
            )}
            <div className="text-xs space-y-2">
              <p className="font-semibold text-gray-800">Terms & Conditions:</p>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                {Array.isArray(coupon.terms) && coupon.terms.length > 0 ? (
                  coupon.terms.map((term, idx) => <li key={idx}>{term}</li>)
                ) : typeof coupon.terms === "string" && coupon.terms.trim() ? (
                  <li>{coupon.terms}</li>
                ) : (
                  <>
                    <li>Applicable only on selected payment methods</li>
                    <li>Cannot be combined with any other offer</li>
                    <li>Valid for one-time use per user</li>
                    <li>
                      Offer valid till{" "}
                      {coupon.expire_date
                        ? new Date(coupon.expire_date).toLocaleDateString(
                            "en-IN",
                          )
                        : "limited time"}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Updated CouponPage with wallet balance section
  const CouponPage = () => {
    const [localSelectedCoupon, setLocalSelectedCoupon] =
      useState(selectedCoupon);
    const [couponCode, setCouponCode] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    const handleCouponSelect = (coupon) => {
      if (!isCouponValid(coupon)) {
        toast.error("This coupon is not valid or has expired");
        return;
      }
      setLocalSelectedCoupon(coupon);
    };

    const handleCheckCode = async () => {
      if (!couponCode.trim()) return;
      setIsChecking(true);
      setTimeout(() => {
        const matchingCoupon = availableCoupons.find(
          (c) => c.code.toLowerCase() === couponCode.toLowerCase(),
        );
        if (matchingCoupon && isCouponValid(matchingCoupon)) {
          setLocalSelectedCoupon(matchingCoupon);
          toast.success("Coupon code verified!");
        } else {
          toast.error("Invalid or expired coupon code");
        }
        setIsChecking(false);
      }, 1000);
    };

    const handleApplyCoupon = () => {
      if (localSelectedCoupon) {
        setSelectedCoupon(localSelectedCoupon);
        setShowCouponPage(false);
        const total = calculateTotal();
        toast.success(
          `Coupon ${localSelectedCoupon.code} applied! You save ₹${total.discount.toFixed(2)}`,
        );
      } else {
        toast.error("Please select or enter a valid coupon");
      }
    };

    // Filter valid and invalid coupons
    const validCoupons = availableCoupons.filter((coupon) =>
      isCouponValid(coupon),
    );
    const invalidCoupons = availableCoupons.filter(
      (coupon) => !isCouponValid(coupon),
    );

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={() => setShowCouponPage(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors mr-3"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-[#502DA6] flex-1">
            Coupons
          </h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Wallet Balance Section */}
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Available Balance
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {loadingWallet ? (
                      <div className="w-24 h-6 bg-gray-100 rounded animate-pulse"></div>
                    ) : (
                      `₹ ${walletBalance}`
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCouponPage(false);
                  if (walletBalance > 0) {
                    setUseWalletBalance(!useWalletBalance);
                  }
                }}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  walletBalance > 0
                    ? useWalletBalance
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      : "bg-[#522EC8] text-white hover:bg-[#441EB8] shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={walletBalance <= 0}
              >
                {useWalletBalance ? "Applied" : "Apply Balance"}
              </button>
            </div>
            {walletBalance <= 0 && (
              <p className="text-xs text-gray-500 mt-3">
                Insufficient balance. Add funds or refer friends to earn
                rewards.
              </p>
            )}
          </div>
          {/* Enter Coupon Code Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter coupon code
            </label>
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleCheckCode()}
              />
              <button
                onClick={handleCheckCode}
                disabled={isChecking || !couponCode.trim()}
                className={`px-4 py-2 font-semibold rounded-r-lg transition-colors ${
                  isChecking || !couponCode.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#502DA6] text-white hover:bg-[#3d2180]"
                }`}
              >
                {isChecking ? "..." : "CHECK"}
              </button>
            </div>
          </div>

          {/* Loading overlay */}
          {loadingCoupons ? (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-[#502DA6] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-600">
                  Loading Offers...
                </p>
              </div>
            </div>
          ) : null}

          {/* Valid Coupons Section */}
          {validCoupons.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Available Coupons
              </h3>
              <div className="space-y-4">
                {validCoupons.map((coupon) => (
                  <CouponTicket
                    key={coupon.id}
                    coupon={coupon}
                    onSelect={handleCouponSelect}
                    isSelected={localSelectedCoupon?.id === coupon.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invalid Coupons */}
          {invalidCoupons.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Expired Coupons
              </h3>
              <div className="space-y-3 opacity-60">
                {invalidCoupons.map((coupon) => (
                  <CouponTicket
                    key={coupon.id}
                    coupon={coupon}
                    onSelect={handleCouponSelect}
                    isSelected={localSelectedCoupon?.id === coupon.id}
                  />
                ))}
              </div>
            </div>
          )}

          {availableCoupons.length === 0 && !loadingCoupons && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No coupons available at the moment.
              </p>
            </div>
          )}

          {/* Apply Button Section */}
          {localSelectedCoupon && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Selected Coupon
                </span>
                <span className="font-semibold text-[#502DA6]">
                  {localSelectedCoupon.code}
                </span>
              </div>
              <button
                onClick={handleApplyCoupon}
                className="w-full py-3 px-4 bg-[#502DA6] hover:bg-[#3d2180] text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                APPLY COUPON
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={closeModal} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              enter="transform transition ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg">
                {showCouponPage ? (
                  <CouponPage />
                ) : (
                  <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center px-2 py-5 border-b border-gray-200">
                      {isInitialLoad ? (
                        <Skeleton circle width={32} height={32} />
                      ) : (
                        <button
                          onClick={handleBackClick}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <ArrowBack className="h-5 w-5 text-gray-700" />
                        </button>
                      )}
                      {isInitialLoad ? (
                        <Skeleton width={180} height={32} />
                      ) : (
                        <Dialog.Title className="text-xl ml-2 font-semibold text-[#502DA6]">
                          {showPaymentSummary
                            ? "Payment Summary"
                            : "Booking Summary"}
                        </Dialog.Title>
                      )}
                    </div>
                    {selectedServices.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-2">
                        {isInitialLoad ? (
                          <>
                            <Skeleton circle width={160} height={160} />
                            <Skeleton
                              width={150}
                              height={24}
                              className="mt-6"
                            />
                            <Skeleton
                              width={250}
                              height={16}
                              className="mt-3"
                            />
                            <Skeleton
                              width={200}
                              height={48}
                              className="mt-6"
                            />
                          </>
                        ) : (
                          <>
                            <div className="w-60 h-60 flex items-center justify-center mb-3">
                              <img
                                src={EmptyCart}
                                className="w-60 h-60"
                                alt="Your Cart Is Empty"
                              />
                            </div>
                            <p className="text-gray-500 text-lg font-medium">
                              Your Cart Is Empty
                            </p>
                            <p className="text-gray-400 text-sm text-center mb-3">
                              Add Offers from the salon to start your booking.
                            </p>
                            <button
                              onClick={handleAddMoreServices}
                              className="px-3py-3 bg-[#502DA6] text-white rounded-lg border border-[#502DA6] hover:bg-[#3d2180] transition-colors flex items-center"
                            >
                              <PlusIcon className="w-5 h-5 mr-2" />
                              Add Best Offers
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto">
                        {/* Applied Coupon and Wallet Display */}
                        {(selectedCoupon || useWalletBalance) && (
                          <div className="m-3 space-y-2">
                            {selectedCoupon && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <TicketPercent className="w-5 h-5 text-green-600 mr-2" />
                                    <div>
                                      <p className="font-medium text-green-800">
                                        {selectedCoupon.description} Applied
                                      </p>
                                      <div className="text-xs text-green-500 mt-1">
                                        {getCouponStatus(selectedCoupon).text}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={handleRemoveCoupon}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                            {useWalletBalance && (
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Wallet className="w-5 h-5 text-purple-600 mr-2" />
                                    <div>
                                      <p className="font-medium text-purple-800">
                                        Wallet Balance Applied
                                      </p>
                                      <div className="text-xs text-purple-500 mt-1">
                                        ₹{walletBalance} available
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setUseWalletBalance(false)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {!showPaymentSummary ? (
                          <>
                            {/* Services list */}
                          <div className="p-4 space-y-6 bg-white  border border-gray-200 shadow-sm">
  {/* Header with classic styling */}
  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
    <div className="flex items-center space-x-2">
      <div className="w-1 h-6 bg-[#5A35CF]"></div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Selected Services
      </h3>
    </div>
    <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-[#5A35CF] bg-[#F5F0FF] rounded">
      {selectedServices.reduce((sum, s) => sum + (s.quantity || 1), 0)} item{selectedServices.length !== 1 ? "s" : ""}
    </div>
  </div>

  {/* Services list with classic card design */}
  <div className="space-y-3">
    {selectedServices.map((service) => {
      const servicePrice = service.price || 0;
      const actualPrice = service.actual_price || servicePrice;
      const discountAmount = actualPrice - servicePrice;
      const discountPercent = actualPrice > 0 ? Math.round((discountAmount / actualPrice) * 100) : 0;
      const totalServicePrice = servicePrice * (service.quantity || 1);
      const totalActualPrice = actualPrice * (service.quantity || 1);
      const totalDiscount = totalActualPrice - totalServicePrice;
      
      return (
        <div
          key={service.id}
          id={`booking-item-${service.id}`}
          className="border border-gray-200 bg-white rounded-lg transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex p-3">
            {/* Media container - classic style */}
            <div className="rounded overflow-hidden w-16 h-16 mr-4 flex-shrink-0 bg-gray-100 border border-gray-200">
              {service?.service_image || service?.image || service?.video ? (
                renderMediaContent(service)
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-base font-medium">
                    {(service.service_name || service.name)?.charAt(0) || "O"}
                  </span>
                </div>
              )}
            </div>

            {/* Details area */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <h3 className="font-medium text-gray-800 text-sm leading-tight mb-1">
                    {service.service_name || service.name}
                  </h3>
                  
                  {/* Price display with actual and discounted */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="font-semibold text-[#5A35CF] text-base">
                      ₹{totalServicePrice.toFixed(2)}
                    </p>
                    {actualPrice > servicePrice && (
                      <>
                        <p className="text-xs text-gray-400 line-through">
                          ₹{totalActualPrice.toFixed(2)}
                        </p>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          Save ₹{totalDiscount.toFixed(0)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Per unit price info for multi-quantity items */}
                  {(service.quantity || 1) > 1 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      ₹{servicePrice.toFixed(2)} per unit
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeService(service.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {service.isOffer && (
                <button
                  onClick={() => setShowTermsModal(service)}
                  className="text-xs text-[#5A35CF] bg-[#F5F0FF] px-2 py-1 rounded mt-1.5 mb-2 inline-flex items-center hover:bg-[#EDE6FF] transition-colors"
                >
                  <DocumentTextIcon className="w-3 h-3 mr-1" />
                  View Terms & Conditions
                </button>
              )}

              <div className="flex items-center justify-between mt-2">
                {!service.isOffer && (
                  <div className="flex items-center border border-gray-300 rounded bg-white">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuantityChange(service.id, -1);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        handleQuantityChange(service.id, -1);
                      }}
                      className="px-2 py-1 text-gray-600 hover:text-[#5A35CF] hover:bg-gray-50 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm text-gray-700 min-w-[28px] text-center">
                      {service.quantity || 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuantityChange(service.id, 1);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        handleQuantityChange(service.id, 1);
                      }}
                      className="px-2 py-1 text-gray-600 hover:text-[#5A35CF] hover:bg-gray-50 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                )}
                <div className="text-gray-400 text-xs">
                  Expires {service.expire_date}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* Terms & Conditions Modal - Classic Design */}
  <Transition show={!!showTermsModal} as={React.Fragment}>
    <Dialog onClose={() => setShowTermsModal(null)} className="relative z-50">
      <Transition.Child
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/50" />
      </Transition.Child>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Transition.Child
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title as="h3" className="text-lg font-semibold text-gray-800 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2 text-[#5A35CF]" />
                Offer Terms & Conditions
              </Dialog.Title>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {showTermsModal?.terms_and_conditions ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Valid only on weekdays</h4>
                    <p className="text-sm text-gray-600">This offer is valid from Monday to Friday only.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Advance booking required</h4>
                    <p className="text-sm text-gray-600">Please book your appointment at least 24 hours in advance.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Non-transferable</h4>
                    <p className="text-sm text-gray-600">This offer cannot be transferred to another person.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Limited availability</h4>
                    <p className="text-sm text-gray-600">Subject to availability at selected salons only.</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No terms and conditions available for this offer.</p>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-[#5A35CF] hover:text-[#4A2ABF] hover:bg-gray-100 rounded transition-colors"
                onClick={() => setShowTermsModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="ml-3 px-4 py-2 text-sm font-medium text-white bg-[#5A35CF] hover:bg-[#4A2ABF] rounded transition-colors"
                onClick={() => setShowTermsModal(null)}
              >
                I Understand
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>

  {/* Action Buttons - Classic Design */}
  <div className="space-y-2 ">
    <button
      onClick={handleAddMoreServices}
      className="w-full py-2.5 px-4 border border-[#5A35CF] text-[#5A35CF] text-sm font-medium rounded hover:bg-[#F5F0FF] transition-colors flex items-center justify-center"
    >
      <PlusIcon className="w-4 h-4 mr-2" />
      Add More Services
    </button>
    <button
      onClick={handleApplyCoupon}
      className="w-full py-2.5 px-4 bg-[#5A35CF] text-white text-sm font-medium rounded hover:bg-[#4A2ABF] transition-colors flex items-center justify-center"
    >
      <BadgePercentIcon className="w-4 h-4 mr-2" />
      Apply Coupon Code
    </button>
  </div>
</div>


                           {/* Booking Type Selection - Professional Header */}
<div className="px-4 pt-4 pb-2 bg-white border-t border-gray-100">
  <div className="flex items-center space-x-3">
    <div className="w-1 h-7 bg-[#5A35CF]"></div>
    <div>
      <h3 className="text-base font-semibold text-gray-800 tracking-wide">
        Book Appointment
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">
        Select your preferred date & time
      </p>
    </div>
  </div>
</div>

{/* Booking Time Section - Professional Card Design */}
<div className="p-3 bg-white border border-gray-100 rounded-lg mx-4 mb-4 shadow-sm">
  {/* Date Selection */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2.5">
      <span className="flex items-center">
        <CalendarIcon className="w-4 h-4 mr-2 text-[#5A35CF]" />
        Select Date
      </span>
    </label>
    <input
      type="date"
      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5A35CF] focus:border-[#5A35CF] bg-white text-gray-700 text-sm transition-all duration-200"
      value={bookingDate}
      onChange={(e) => handleDateChange(e.target.value)}
      min={new Date().toISOString().split("T")[0]}
    />
  </div>

  {/* Time Slot Selection */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-3">
      <span className="flex items-center">
        <ClockIcon className="w-4 h-4 mr-2 text-[#5A35CF]" />
        Select Your Preferred Time
      </span>
    </label>
    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
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
        const isTimeSlotAvailable = () => {
          const isToday =
            bookingDate === new Date().toISOString().split("T")[0];
          if (!isToday) return true;

          const now = new Date();
          const [timeStr, period] = time.split(" ");
          let [hours, minutes] = timeStr.split(":").map(Number);

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          const slotTime = new Date();
          slotTime.setHours(hours, minutes, 0, 0);
          return slotTime > now;
        };

        const isAvailable = isTimeSlotAvailable();

        return (
          <button
            key={time}
            onClick={() => isAvailable && setSelectedTime(time)}
            disabled={!isAvailable}
            className={`
              relative px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${
                selectedTime === time
                  ? "bg-[#5A35CF] border-[#5A35CF] text-white shadow-sm"
                  : isAvailable
                  ? "bg-white border-gray-200 text-gray-700 hover:border-[#5A35CF] hover:text-[#5A35CF] hover:bg-[#F5F0FF]"
                  : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
              }
            `}
          >
            {time}
          </button>
        );
      })}
    </div>
    {!selectedTime && bookingDate && (
      <p className="text-xs text-amber-600 mt-2 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Please select a time slot to continue
      </p>
    )}
  </div>

  {/* Proceed to Payment Button */}
  <button
    onClick={handleBooking}
    disabled={isProcessing || !bookingDate || !selectedTime}
    className={`
      mt-4 w-full py-3 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200
      ${
        isProcessing || !bookingDate || !selectedTime
          ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#5A35CF] hover:bg-[#4A2ABF] text-white shadow-sm hover:shadow-md"
      }
    `}
  >
    {isProcessing ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </>
    ) : !bookingDate ? (
      "Select a Date"
    ) : !selectedTime ? (
      "Select a Time Slot"
    ) : (
      <>
        Proceed to Payment
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </>
    )}
  </button>

  {/* Booking Summary - Optional Professional Touch */}
  {bookingDate && selectedTime && (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Selected appointment:</span>
        <span className="font-medium text-gray-700">
          {new Date(bookingDate).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })} • {selectedTime}
        </span>
      </div>
    </div>
  )}
</div>


                          </>
                        ) : (
                          <>
                            {/* Payment Summary Section */}
                         <div className="p-1 bg-gray-50">
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Booking Details Header */}
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-1 h-6 bg-[#5A35CF]"></div>
        <h3 className="font-semibold text-gray-800 text-lg tracking-wide">
          Booking Details
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Appointment Date
          </p>
          <p className="font-medium text-gray-800 text-sm">
            {new Date(bookingDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Appointment Time
          </p>
          <p className="font-medium text-gray-800 text-sm">
            {selectedTime}
          </p>
        </div>
        <div className="col-span-2 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Approx Duration
          </p>
          <p className="font-medium text-gray-800 text-sm">
            {calculateDuration().formatted}
          </p>
        </div>
      </div>
    </div>

    {/* Selected Services Summary */}
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-5 bg-[#5A35CF] opacity-60"></div>
          <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Selected Services
          </h4>
        </div>
        <span className="text-xs font-medium text-[#5A35CF] bg-[#F5F0FF] px-2 py-1 rounded">
          {selectedServices.length} item{selectedServices.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {selectedServices.map((service) => {
          const servicePrice = service.price || 0;
          const totalServicePrice = servicePrice * (service.quantity || 1);
          const actualPrice = service.actual_price || servicePrice;
          const hasDiscount = actualPrice > servicePrice;
          
          return (
            <div
              key={service.id}
              className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="font-medium text-gray-800 text-sm truncate max-w-[180px]">
                    {service.service_name || service.name}
                  </span>
                  {service.isOffer && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F5F0FF] text-[#5A35CF]">
                      Offer
                    </span>
                  )}
                  {!service.isOffer && service.quantity && service.quantity > 1 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                      x{service.quantity}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Save ₹{(actualPrice - servicePrice).toFixed(0)} per unit
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-[#5A35CF] text-sm">
                  ₹{totalServicePrice.toFixed(2)}
                </p>
                {hasDiscount && (
                  <p className="text-[10px] text-gray-400 line-through">
                    ₹{(actualPrice * (service.quantity || 1)).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Price Breakdown */}
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-1 h-5 bg-[#5A35CF] opacity-60"></div>
        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Price Breakdown
        </h4>
      </div>
      
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Subtotal ({selectedServices.reduce((sum, s) => sum + (s.quantity || 1), 0)} items)
          </span>
          <span className="font-medium text-gray-700 text-sm">
            ₹{calculateTotal().subtotal.toFixed(2)}
          </span>
        </div>
        
        {selectedCoupon && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-green-600">
              <BadgePercentIcon className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-sm">Discount ({selectedCoupon.code})</span>
            </div>
            <span className="font-medium text-green-600 text-sm">
              -₹{calculateTotal().discount.toFixed(2)}
            </span>
          </div>
        )}
        
        {useWalletBalance && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-[#5A35CF]">
              <Wallet className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-sm">Wallet Balance</span>
            </div>
            <span className="font-medium text-[#5A35CF] text-sm">
              -₹{calculateTotal().walletAmountUsed.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">Convenience Fee</span>
          <span className="text-sm text-gray-400">₹0</span>
        </div>
      </div>
      
      {/* Total Amount */}
      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total Amount</span>
          <span className="font-bold text-xl text-[#5A35CF]">
            ₹{calculateTotal().finalAmountAfterWallet.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Payment Info Card */}
      <div className="border border-[#E8E0FF] rounded-lg overflow-hidden mb-5">
        <div className="bg-[#F8F5FF] p-4">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 bg-[#5A35CF] rounded-lg flex items-center justify-center flex-shrink-0">
              <InformationCircleIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#5A35CF] text-sm mb-2">
                Payment Information
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-red-500 font-bold mr-2">•</span>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-red-600">₹11 is non-refundable</span> under any condition
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#5A35CF] font-bold mr-2">•</span>
                  <p className="text-sm text-gray-700">
                    Pay <span className="font-semibold">₹{calculateTotal().payableAmount.toFixed(2)}</span> now to confirm booking
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#5A35CF] font-bold mr-2">•</span>
                  <p className="text-sm text-gray-700">
                    Balance <span className="font-semibold">₹{(calculateTotal().finalAmountAfterWallet - calculateTotal().payableAmount).toFixed(2)}</span> payable at salon
                  </p>
                </div>
                {selectedCoupon && (
                  <div className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <p className="text-sm text-green-700">
                      You saved <span className="font-semibold">₹{calculateTotal().discount.toFixed(2)}</span> with {selectedCoupon.code}
                    </p>
                  </div>
                )}
                {useWalletBalance && (
                  <div className="flex items-start">
                    <span className="text-[#5A35CF] font-bold mr-2">✓</span>
                    <p className="text-sm text-[#5A35CF]">
                      Used <span className="font-semibold">₹{calculateTotal().walletAmountUsed.toFixed(2)}</span> from wallet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Button */}
      <button
        onClick={initiatePayment}
        disabled={paymentProcessing}
        className={`
          w-full py-3 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200
          ${
            paymentProcessing
              ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#5A35CF] hover:bg-[#4A2ABF] text-white shadow-sm hover:shadow-md"
          }
        `}
      >
        {paymentProcessing ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing Payment...
          </>
        ) : (
          `Pay ₹${calculateTotal().payableAmount.toFixed(2)} Now`
        )}
      </button>
      
      {/* Divider */}
      <div className="flex items-center w-full my-5">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
          Or
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      {/* WhatsApp Info Button */}
      <button
        onClick={handleWhatsAppInfo}
        disabled={!bookingDate || !selectedTime}
        className={`
          w-full py-3 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200 border
          ${
            !bookingDate || !selectedTime
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-[#25D366] border-[#25D366] hover:bg-[#25D366] hover:text-white"
          }
        `}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Get More Info on WhatsApp
      </button>
    </div>
  </div>
</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingModule;