import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../../context/Auth";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    salon: "",
  });

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salonLoading, setSalonLoading] = useState(true);
  const { authTokens, user, userData } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const salonData = location.state?.salonData;

  useEffect(() => {
    const fetchBookedSalons = async () => {
      try {
        setSalonLoading(true);
        const salonUserId = user?.user_id;
        const userPhone = userData?.phone_number;

        if (!salonUserId || !userPhone) {
          console.error("Missing user data");
          setSalonLoading(false);
          return;
        }

        const response = await fetch(
          `https://backendapi.trakky.in/salons/booking/?section=history&is_payment_done=true&salonuser=${salonUserId}&user_phone=${userPhone}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const uniqueSalons = data.reduce((acc, booking) => {
            if (
              booking.salon &&
              booking.status === "completed" &&
              !acc.find((s) => s.id === booking.salon)
            ) {
              acc.push({
                id: booking.salon,
                name: booking.salon_name,
                city: booking.salon_city,
                area: booking.salon_area,
              });
            }
            return acc;
          }, []);

          setSalons(uniqueSalons);

          if (salonData && uniqueSalons.length > 0) {
            const matchingSalon = uniqueSalons.find((salon) => {
              if (salon.id.toString() === salonData.salonId?.toString()) {
                return true;
              }
              if (
                salon.name === salonData.salonName &&
                salon.city === salonData.salonCity
              ) {
                return true;
              }
              return false;
            });

            if (matchingSalon) {
              setFormData((prev) => ({
                ...prev,
                salon: matchingSalon.id.toString(),
              }));
            }
          }
        } else {
          toast.error("Failed to load salons");
        }
      } catch (error) {
        console.error("Error fetching salons:", error);
        toast.error("Error loading salons");
      } finally {
        setSalonLoading(false);
      }
    };

    if (user?.user_id && userData?.phone_number && authTokens) {
      fetchBookedSalons();
    } else {
      setSalonLoading(false);
    }
  }, [user, userData, authTokens, salonData]);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.full_name || "",
        phone: userData.phone_number || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.salon) {
      toast.error("Please select a salon");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your feedback message");
      return;
    }

    if (!user?.user_id) {
      toast.error("User id not found");
      return;
    }

    try {
      setLoading(true);

      const feedbackData = {
        salon_user: user.user_id,
        salon: parseInt(formData.salon),
        feedback_text: formData.message.trim(),
        email: formData.email || "",
      };

      const response = await fetch(
        "https://backendapi.trakky.in/salons/feedback-salon/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(feedbackData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Feedback submitted successfully!");

        setFormData({
          name: userData?.full_name || "",
          phone: userData?.phone_number || "",
          email: userData?.email || "",
          message: "",
          salon: "",
        });

        setTimeout(() => {
          navigate("/userProfile/my-bookings");
        }, 2000);
      } else {
        if (responseData.salon_user) {
          toast.error(`User error: ${responseData.salon_user.join(", ")}`);
        } else if (responseData.salon) {
          toast.error(`Salon error: ${responseData.salon.join(", ")}`);
        } else if (responseData.feedback_text) {
          toast.error(`Feedback error: ${responseData.feedback_text.join(", ")}`);
        } else {
          toast.error("Failed to submit feedback. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedSalonName =
    salons.find((salon) => salon.id.toString() === formData.salon)?.name || "";

  return (
    <div className=" bg-gray-50 py-8 md:px-4 px-2">
      <Toaster position="top-right" />
      
      <div className="">
        {/* Header */}
        <div className=" mb-8">
          <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-3 ">Share Your Feedback</h1>
          <div className="w-20 h-1 bg-[#502DA6]  mb-4"></div>
          <p className="text-gray-600">
            Your feedback helps us improve our services
          </p>
        </div>

        {/* Prefilled Info */}
        {salonData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">i</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-blue-800 text-sm">
                  Providing feedback for: <strong>{salonData.salonName}</strong>
                  {selectedSalonName && (
                    <span className="block mt-1">
                      Auto-selected: <strong>{selectedSalonName}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Salon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Salon *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                name="salon"
                value={formData.salon}
                onChange={handleChange}
                required
                disabled={salonLoading}
              >
                <option value="">Choose a salon</option>
                {salonLoading ? (
                  <option value="" disabled>Loading salons...</option>
                ) : salons.length > 0 ? (
                  salons.map((salon) => (
                    <option key={salon.id} value={salon.id}>
                      {salon.name} - {salon.area}, {salon.city}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No completed bookings found</option>
                )}
              </select>
              
              {salons.length === 0 && !salonLoading && (
                <p className="text-sm text-red-500 mt-2">
                  You need to have completed bookings first to submit feedback.
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none bg-white text-gray-900"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share your thoughts about your experience at the salon..."
                rows="5"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#502DA6] text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || salonLoading || salons.length === 0}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    SUBMITTING FEEDBACK...
                  </div>
                ) : (
                  "SUBMIT FEEDBACK"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">ℹ</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-gray-600 text-sm">
                Your honest feedback helps us improve our services and maintain quality standards. 
                We appreciate you taking the time to share your experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;