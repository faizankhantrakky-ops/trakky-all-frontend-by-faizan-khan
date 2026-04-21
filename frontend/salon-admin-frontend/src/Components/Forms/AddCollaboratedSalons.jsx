import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddCollaborated = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(null);
  const [selectSalonId, setSelectSalonId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectSalonId) {
      toast.error("Please select a salon", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("salon", selectSalonId);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/collaborated/`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (response.status === 201) {
        toast.success("Added successfully!", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
        });
        setSelectSalonId("");
        setSelectedSalons(null);
        setSelectedCity("");
      } else if (response.status === 400 && responseData.salon) {
        toast.error(responseData.salon[0], {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "Subject", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("Failed to add. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCity = async () => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/city/`);
      const data = await response.json();
      const cityList = data?.payload?.map((item) => item.name) || [];
      setCity(cityList);
    } catch (err) {
      toast.error("Failed to load cities", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    }
  };

  const loadSalons = async (inputValue, callback) => {
    if (!inputValue || !selectedCity) {
      callback([]);
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
          inputValue
        )}&city=${selectedCity}`
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const options = data?.results?.map((salon) => ({
        value: salon.id,
        label: salon.name,
      })) || [];

      callback(options);
    } catch (error) {
      console.error("Error loading salons:", error);
      callback([]);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  // Custom styles for AsyncSelect
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#d1d5db",
      borderRadius: "0.5rem",
      padding: "0.25rem 0",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
      "&:focus-within": { borderColor: "#3b82f6", ring: "2px solid #3b82f6" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      marginTop: "0.25rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#2563eb"
        : isFocused
        ? "#dbeafe"
        : "white",
      color: isSelected ? "white" : "#1f2937",
    }),
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto p-3">

          {/* === PROFESSIONAL HEADER === */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-5 py-5">
              <h1 className="text-xl font-bold text-gray-900">
                Add Collaborated Salon
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Select a city and search for a salon to collaborate with
              </p>
            </div>
          </div>

          {/* === FORM CARD === */}
          <div className="bg-white rounded-b-xl shadow-sm p-6 -mt-1 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* === CITY + SALON SEARCH (40% / 60%) === */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 40% → City Select */}
                <div className="lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedSalons(null);
                      setSelectSalonId("");
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="">Choose a city...</option>
                    {city.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 60% → Salon Search */}
                <div className="lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Salon <span className="text-red-500">*</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      Must belong to selected city
                    </span>
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadSalons}
                    defaultOptions
                    value={selectedSalons}
                    onChange={(option) => {
                      setSelectedSalons(option);
                      setSelectSalonId(option?.value || "");
                    }}
                    isDisabled={!selectedCity}
                    placeholder="Type salon name..."
                    noOptionsMessage={() =>
                      selectedCity ? "No salons found" : "Select a city first"
                    }
                    loadingMessage={() => "Searching..."}
                    styles={customStyles}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* === SUBMIT BUTTON === */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectSalonId}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    isSubmitting || !selectSalonId
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    "Add Collaboration"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCollaborated;