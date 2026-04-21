import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../../context/Auth";

const Report = () => {
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [salonList, setSalonList] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState("");
  const [experience, setExperience] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authTokens, user, userData } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const salonUser = user?.user_id;
  const userPhone = userData?.phone_number;
  const salonData = location.state?.salonData;

  useEffect(() => {
    fetch("https://backendapi.trakky.in/salons/city/")
      .then((response) => response.json())
      .then((data) => setCityList(data.payload))
      .catch((error) => console.error("Error fetching city list:", error));
  }, []);

  useEffect(() => {
    if (authTokens && salonUser && userPhone) {
      fetchUserBookings();
    }
  }, [authTokens, salonUser, userPhone]);

  useEffect(() => {
    if (salonData) {
      setSelectedCity(salonData.salonCity);
    }
  }, [salonData]);

  const fetchUserBookings = () => {
    setIsLoading(true);
    fetch(
      `https://backendapi.trakky.in/salons/booking/?section=history&is_payment_done=true&salonuser=${salonUser}&user_phone=${userPhone}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUserBookings(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user bookings:", error);
        setIsLoading(false);
        toast.error("Failed to load booking history");
      });
  };

  useEffect(() => {
    if (selectedCity && userBookings.length > 0) {
      const seenSalonIds = new Set();
      const filteredSalons = [];

      userBookings.forEach((booking) => {
        if (
          booking.salon_city?.toLowerCase() === selectedCity.toLowerCase() &&
          booking.status === "completed" &&
          booking.salon &&
          !seenSalonIds.has(booking.salon)
        ) {
          seenSalonIds.add(booking.salon);
          filteredSalons.push({
            id: booking.salon,
            name: booking.salon_name,
            city: booking.salon_city,
            area: booking.salon_area,
          });
        }
      });

      setSalonList(filteredSalons);

      if (salonData && filteredSalons.length > 0) {
        const matchingSalon = filteredSalons.find((salon) => {
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
          setSelectedSalon(matchingSalon.id.toString());
        }
      }
    } else {
      setSalonList([]);
      setSelectedSalon("");
    }
  }, [selectedCity, userBookings, salonData]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setSelectedSalon("");
  };

  const handleSalonChange = (event) => {
    setSelectedSalon(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedCity) {
      toast.error("Please select a city");
      return;
    }

    if (!selectedSalon) {
      toast.error("Please select a salon");
      return;
    }

    if (!experience.trim()) {
      toast.error("Please share your experience");
      return;
    }

    const hasValidBooking = userBookings.some(
      (booking) =>
        booking.salon.toString() === selectedSalon &&
        booking.status === "completed" &&
        booking.is_payment_done === true
    );

    if (!hasValidBooking) {
      toast.error(
        "No completed booking found for this salon. Please ensure you have a completed booking to submit a report."
      );
      return;
    }

    const reportData = {
      salon: parseInt(selectedSalon),
      reported_text: experience.trim(),
      salon_user: salonUser,
    };

    setIsLoading(true);
    fetch("https://backendapi.trakky.in/salons/salon-reports/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access_token}`,
      },
      body: JSON.stringify(reportData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.id) {
          toast.success("Report submitted successfully!");
          setSelectedCity("");
          setSelectedSalon("");
          setExperience("");
          setTimeout(() => {
            navigate("/userProfile/my-bookings");
          }, 2000);
        } else {
          const errorMessage = Object.values(data).flat().join(", ");
          toast.error(`Submission failed: ${errorMessage}`);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error submitting report:", error);
        toast.error("Failed to submit report. Please try again.");
      });
  };

  const selectedSalonName =
    salonList.find((salon) => salon.id.toString() === selectedSalon)?.name ||
    "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:px-4 px-2">
      <Toaster position="top-right" />
      
      <div className="">
        {/* Header */}
        <div className=" mb-8">
          <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-3 ">Report Salon</h1>
          <div className="w-20 h-1 bg-[#502DA6] "></div>
          <p className="text-gray-600 mt-4">
            Share your experience to help us improve our services
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
                  Reporting salon: <strong>{salonData.salonName}</strong> from your booking history.
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
          <div className="space-y-6">
            {/* City Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={isLoading}
              >
                <option value="">Select a City</option>
                {cityList.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Salon Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salon
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                value={selectedSalon}
                onChange={handleSalonChange}
                disabled={isLoading || !selectedCity}
              >
                <option value="">Select a Salon</option>
                {salonList.map((salon) => (
                  <option key={salon.id} value={salon.id}>
                    {salon.name} - {salon.area}
                  </option>
                ))}
              </select>
              {selectedCity && salonList.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  No completed bookings found in {selectedCity}
                </p>
              )}
            </div>

            {/* Experience Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Your Experience
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none bg-white text-gray-900"
                value={experience}
                onChange={handleExperienceChange}
                disabled={isLoading}
                placeholder="Please share your thoughts about your experience at the salon..."
                rows="6"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="w-full bg-[#502DA6] text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    SUBMITTING...
                  </div>
                ) : (
                  "SUBMIT REPORT"
                )}
              </button>
            </div>
          </div>
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
                Your feedback helps us maintain quality standards and improve services for all customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;